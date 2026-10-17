'use strict';
const assetBase='https://alastor-4dev.github.io/blanco-narciso/img/';
const terms='Acumula 1 punto por cada $1 MXN de compras elegibles pagadas. Cada 500 puntos completa un sello. Al reunir 2,500 puntos y cinco sellos, canjéalos por un arreglo mediano o por otro arreglo de valor equivalente al precio del mediano vigente el día del canje. Beneficio personal e intransferible, no acumulable con promociones, descuentos o cupones, ni canjeable por efectivo. Sujeto a disponibilidad. Los pedidos cancelados o reembolsados no generan beneficios.';
const field=fieldPath=>({firstValue:{fields:[{fieldPath}]}});
function classDesign() {
  return {
    programName:'Sigue floreciendo',
    hexBackgroundColor:'#6f917e',
    programLogo:{sourceUri:{uri:assetBase+'wallet-logo-v2.png'}},
    wideProgramLogo:{sourceUri:{uri:assetBase+'wallet-wordmark-v4.png'}},
    textModulesData:[{id:'terminos',header:'Términos y condiciones',body:terms}],
    classTemplateInfo:{
      cardBarcodeSectionDetails:{firstTopDetail:{fieldSelector:{fields:[{fieldPath:'object.accountName'}]}}},
      cardTemplateOverride:{cardRowTemplateInfos:[
        {twoItems:{startItem:field("object.textModulesData['compras']"),endItem:field('object.loyaltyPoints')}},
        {twoItems:{startItem:field('object.secondaryLoyaltyPoints'),endItem:field("object.textModulesData['premios']")}}
      ]},
      detailsTemplateOverride:{detailsItemInfos:[
        "object.textModulesData['compras']",'object.loyaltyPoints','object.secondaryLoyaltyPoints',
        "object.textModulesData['faltante']","object.textModulesData['premios']",'object.accountName','object.accountId',
        "class.textModulesData['terminos']"
      ].map(path=>({item:field(path)}))}
    }
  };
}
module.exports={classDesign};
