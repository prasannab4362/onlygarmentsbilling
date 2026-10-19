import {seed,calculate,round} from './core.js';
const KEY='only-garments-v1';
export function validate(data){
 if(data?.version!==1)throw Error('Unsupported backup version.');
 for(const k of ['products','invoices','payments','credits','refunds','purchases','supplierPayments','expenses','cashEntries','reconciliations','customers','suppliers','audit']){
  if(!Array.isArray(data[k]))throw Error('Invalid backup: '+k);
  const ids=new Set();for(const r of data[k]){if(!r||typeof r.id!=='string'||ids.has(r.id))throw Error('Missing or duplicate ID in '+k);ids.add(r.id);}
 }
 const s=data.settings;if(!s||typeof s.shop!=='string'||typeof s.otherMethods!=='string'||!['portrait','landscape'].includes(s.orientation)||!['A4','Roll'].includes(s.paper))throw Error('Invalid shop settings.');
 for(const [k,min,max] of [['width',30,200],['height',20,200],['margin',0,20],['gap',0,20],['columns',1,6],['copies',1,100],['receiptWidth',58,120],['openingCash',0,1e9],['gst',0,100]])if(!Number.isFinite(s[k])||s[k]<min||s[k]>max)throw Error('Invalid setting: '+k);
 const codes=new Set();for(const p of data.products){if(typeof p.name!=='string'||!p.name.trim()||typeof p.barcode!=='string'||!p.barcode||codes.has(p.barcode)||!Number.isFinite(p.price)||p.price<0||p.cost!==null&&(!Number.isFinite(p.cost)||p.cost<0)||!Number.isInteger(p.qty)||p.qty<0)throw Error('Invalid or duplicate product.');codes.add(p.barcode);}
 for(const k of ['invoices','payments','credits','refunds','purchases','supplierPayments','expenses','cashEntries'])for(const r of data[k]){const amount=r.total??r.amount;if(!/^\d{4}-\d{2}-\d{2}$/.test(r.date)||!Number.isFinite(amount)||(k!=='cashEntries'&&amount<0))throw Error('Invalid transaction in '+k);}
 const invoiceIds=new Set(data.invoices.map(i=>i.id)),purchaseIds=new Set(data.purchases.map(p=>p.id)),numbers=new Set();
 for(const i of data.invoices){if(typeof i.number!=='string'||numbers.has(i.number)||!i.shop||!Array.isArray(i.lines))throw Error('Invalid invoice snapshot.');numbers.add(i.number);const totals=calculate(i.lines,i.discount,i.gst,i.inclusive,i.interstate,i.rounding!==0);for(const k of ['subtotal','itemDiscount','taxable','tax','cgst','sgst','igst','cost'])if(totals[k]!==i[k])throw Error('Invoice totals do not match its lines.');if(round(i.taxable+i.tax+i.rounding)!==i.total)throw Error('Invalid invoice total.');}
 for(const k of ['payments','credits','refunds'])for(const p of data[k])if(!invoiceIds.has(p.invoiceId))throw Error('Unlinked '+k+' record.');
 for(const p of data.supplierPayments)if(!purchaseIds.has(p.purchaseId))throw Error('Unlinked supplier payment.');
 for(const i of data.invoices){const sum=key=>round(data[key].filter(p=>p.invoiceId===i.id).reduce((a,p)=>a+p.amount,0));if(sum('payments')>i.total||sum('credits')>i.total||sum('refunds')>sum('payments')||sum('refunds')>sum('credits'))throw Error('Invoice payments or credits exceed allowed amounts.');}
 for(const p of data.purchases)if(round(data.supplierPayments.filter(x=>x.purchaseId===p.id).reduce((a,x)=>a+x.amount,0))>p.total)throw Error('Supplier overpayment in backup.');
 return data;
}
export function load(){const s=localStorage.getItem(KEY);return s?validate(JSON.parse(s)):seed();}
export function persist(data){localStorage.setItem(KEY,JSON.stringify(data));}
export function download(data,name,type='application/json'){const url=URL.createObjectURL(new Blob([typeof data==='string'?data:JSON.stringify(data,null,2)],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
