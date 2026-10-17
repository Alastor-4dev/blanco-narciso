"""Export the current local design as a non-transactional GitHub Pages preview."""
from pathlib import Path
import json
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'estudio-node'
OUT = ROOT / 'out'
BASE = '/blanco-narciso/'
if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir()
for folder in ('css', 'js', 'img'):
    shutil.copytree(SOURCE / folder, OUT / folder)
# Los controles del piloto local no forman parte de la web pública.
for local_asset in ('js/wallet-pilot.js', 'css/wallet-pilot.css'):
    (OUT / local_asset).unlink(missing_ok=True)
(OUT / 'data').mkdir()
shutil.copy2(SOURCE / 'data/products.json', OUT / 'data/products.json')
(OUT / '.nojekyll').touch()
extra_css = '''#cart-btn,#cart-drawer,#cart-overlay{display:none!important}fieldset.preview-form{border:0;padding:0;margin:0;min-width:0}.preview-form-note{font-size:12px;color:#1a2b4a;margin:12px 0}.preview-disabled{cursor:default;opacity:.65}.card-reserve-btn:disabled{cursor:default} @media(min-width:768px) and (max-width:1100px){.nav-links,.nav-reserve{display:none!important}.nav-hamburger{display:block!important}#mobile-drawer{display:block!important}}'''
(OUT / 'css/preview.css').write_text(extra_css)
for filename in ('index.html', 'fidelidad.html'):
    text = (SOURCE / filename).read_text()
    text = re.sub(r'(["\'])/(css|js|img)/', lambda m:m[1]+BASE+m[2]+'/',text)
    text = text.replace('href="/"',f'href="{BASE}"')
    text = text.replace('</head>', '<meta name="robots" content="noindex, nofollow"><link rel="stylesheet" href="'+BASE+'css/preview.css"></head>')
    if filename == 'index.html':
        text = re.sub(r'<form\b([^>]*)>(.*?)</form>',lambda m:'<form'+m[1]+'><p class="preview-form-note">Formulario de muestra desactivado. No se envían mensajes.</p><fieldset disabled class="preview-form">'+m[2]+'</fieldset></form>',text,flags=re.S)
        text = re.sub(r'href="(?:https://wa.me/[^"\s]*|mailto:[^"\s]*|tel:[^"\s]*)"','href="#contacto" aria-disabled="true" class="preview-disabled"',text)
        # The class attribute on existing links must remain unique.
        text = re.sub(r'class="preview-disabled" class="([^"]*)"',r'class="preview-disabled \1"',text)
    else:
        text=text.replace('<p class="preview-label">','<p class="preview-label">')
    (OUT / filename).write_text(text)
(OUT / 'fidelidad').mkdir()
shutil.copy2(OUT / 'fidelidad.html', OUT / 'fidelidad/index.html')
js=(OUT/'js/main.js').read_text()
js=js.replace("fetch('/api/products')",f"fetch('{BASE}data/products.json')")
js=js.replace('Agregar al carrito →','Vista previa').replace('class="card-reserve-btn add-to-cart"','class="card-reserve-btn" disabled')
# Remove network checkout and the simulated contact-success handler from the preview.
start=js.index('async function checkout() {')
end=js.index('\nfunction initCart()',start)
js=js[:start]+"async function checkout() { document.getElementById('cart-error').textContent = 'Pagos no disponibles en esta vista previa.'; }\n"+js[end:]
js=js.replace('  initCart();','  // Carrito desactivado en la vista previa de GitHub Pages.')
js=js.replace('  initForm();','  // Formulario de contacto desactivado en la vista previa.')
(OUT/'js/main.js').write_text(js)
p=OUT/'js/fidelidad.js';p.write_text(p.read_text().replace("'/img/", "'"+BASE+"img/"))
# Only public presentation assets are exported, never server/admin/dependencies.
assert not (OUT/'server.js').exists()
assert not (OUT/'admin.html').exists()
assert len(json.loads((OUT/'data/products.json').read_text())) > 0
assert 'background-color: var(--sage)' in (OUT/'css/style.css').read_text()
print('Current green textured design exported to out/; backend and transactions excluded.')
