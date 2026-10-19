export const NARROW_ROLL_PRESETS={
 'Narrow roll 50 × 25':[50,25],
 'Narrow roll 55 × 25':[55,25],
 'Narrow roll 50 × 20':[50,20],
 'Narrow roll 55 × 20':[55,20]
};
export function applyRollPreset(settings,name='Narrow roll 50 × 25'){
 const size=NARROW_ROLL_PRESETS[name];if(!size)throw Error('Unknown roll preset.');
 Object.assign(settings,{width:size[0],height:size[1],paper:'Roll',rollFeed:'Narrow edge across roll',columns:1,gap:0,margin:0,orientation:'portrait',labelLayout:'Landscape reference',printerModel:'TSC TTP-244 Plus'});
}
export function rollGeometry(s){const rotated=s.rollFeed==='Narrow edge across roll';return {rotated,width:Number(rotated?s.height:s.width),height:Number(rotated?s.width:s.height)};}
export function rollHelp(s){if(s.paper!=='Roll')return `${s.width} × ${s.height} mm sticker · ${s.columns} columns · A4 sheet`;const r=rollGeometry(s);return `${s.width} × ${s.height} mm artwork · Printer paper: ${r.width} mm across × ${r.height} mm feed · One sticker per page${r.rotated?' · Artwork rotated 90°':''}`;}
