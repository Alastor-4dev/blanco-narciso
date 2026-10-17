'use strict';
const assetBase='https://alastor-4dev.github.io/blanco-narciso/img/';
const instagram='https://www.instagram.com/blanconarcisomx/';
const terms='Cada 500 puntos completa un sello. Al reunir 2,500 puntos y cinco sellos, canjéalos por un arreglo mediano o su equivalente al día del canje. Beneficio personal e intransferible, no acumulable con promociones, descuentos o cupones. Sujeto a disponibilidad. Los pedidos cancelados o reembolsados no generan beneficios. Presenta tu tarjeta al personal para registrar cada visita y validar tu recompensa.';
const field=fieldPath=>({firstValue:{fields:[{fieldPath}]}});
function birthDateLabel(value) {
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return 'Por completar';
  const date=new Date(value+'T12:00:00Z');
  if(!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==value)return 'Por completar';
  return new Intl.DateTimeFormat('es-MX',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(date);
}
function classDesign() {
  return {
    programName:'Blanco Narciso',
    hexBackgroundColor:'#6f917e',
    accountIdLabel:'ID de florista',accountNameLabel:'Nombre',
    programLogo:{sourceUri:{uri:assetBase+'wallet-logo-v2.png'}},
    wideProgramLogo:{sourceUri:{uri:assetBase+'wallet-wordmark-v4.png'}},
    textModulesData:[{id:'frase',body:'Sigue floreciendo'},{id:'terminos',header:'Términos y condiciones',body:terms}],
    linksModuleData:{uris:[{id:'instagram',uri:instagram,description:'Instagram · @blanconarcisomx'}]},
    classTemplateInfo:{
      cardBarcodeSectionDetails:{firstTopDetail:{fieldSelector:{fields:[{fieldPath:"class.textModulesData['frase']"}]}}},
      cardTemplateOverride:{cardRowTemplateInfos:[
        {twoItems:{startItem:field('object.accountId'),endItem:field('object.accountName')}},
        {oneItem:{item:field("object.textModulesData['nacimiento']")}},
        {twoItems:{startItem:field('object.loyaltyPoints'),endItem:field("object.textModulesData['premios']")}}
      ]},
      detailsTemplateOverride:{detailsItemInfos:[
        'object.accountId','object.accountName',"object.textModulesData['nacimiento']",'object.loyaltyPoints',
        "object.textModulesData['premios']","class.linksModuleData.uris['instagram']","class.textModulesData['terminos']"
      ].map(path=>({item:field(path)}))}
    }
  };
}
module.exports={classDesign,birthDateLabel};
