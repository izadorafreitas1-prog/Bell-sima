const products = [
{id:1,name:'Batom Líquido Matte',price:49.90,cat:'lips',img:'https://th.bing.com/th/id/OIP.KP5RfqfBO65cuWqCuif2EAHaHa?w=218&h=218&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',desc:'Longa duração, sem transferência.'},
  {id:2,name:'Paleta de Sombras 12 cores',price:89.90,cat:'eyes',img:'https://th.bing.com/th/id/OIP.-JyvFp2tfeAWNDd_Hh6howHaHa?w=199&h=199&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',desc:'Cores pigmentadas para todo look.'},
   {id:3,name:'Base Líquida HD',price:119.90,cat:'face',img:'https://tse2.mm.bing.net/th/id/OIP._Wd2nC3j_wJfwl884v6ZeQAAAA?rs=1&pid=ImgDetMain&o=7&rm=3',desc:'Acabamento natural, cobertura média.'},
   {id:4,name:'Máscara de Cílios Volumax',price:39.90,cat:'eyes',img:'https://th.bing.com/th/id/OIP.hL9AqgFqVGLiXsyRfc-1jQHaHa?w=219&h=219&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',desc:'Volume e definição instantânea.'},
  {id:5,name:'Pó Compacto Translúcido',price:34.90,cat:'face',img:'https://tse1.mm.bing.net/th/id/OIP.067Ic74Ikh5A4h6pzJg77wHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',desc:'Acabamento matte sem pesar.'},
  {id:6,name:'Lápis de Sobrancelha',price:29.90,cat:'eyes',img:'https://coprobel.vteximg.com.br/arquivos/ids/272106-1000-1000/lapis-para-sobrancelha-2-em-1-02-medium-melu-ruby-rose-1006207-25391.png?v=638342724263270000',desc:'Fácil aplicação e natural.'},
  {id:7,name:'Kit Pincéis 5 peças',price:79.90,cat:'tools',img:'https://http2.mlstatic.com/D_NQ_NP_661865-MLU69364676681_052023-O.webp',desc:'Cerdas macias, ótimo custo-benefício.'},
  {id:8,name:'Iluminador Cremoso',price:54.90,cat:'face',img:'https://www.pigmentta.com/wp-content/uploads/2024/05/Iluminador-Bloom-Highlight-Bloomshell.png',desc:'Glow saudável e fácil de espalhar.'}

];

let state = {query:'',cat:'all',sort:'default',cart:{}};

const grid = document.getElementById('productGrid');
const tpl = document.getElementById('productTpl');
const search = document.getElementById('search');
const sort = document.getElementById('sort');
const cartCount = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

function formatBRL(v){return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}

function render(){
  grid.innerHTML='';
  let list = products.filter(p=> (state.cat==='all'||p.cat===state.cat) && (p.name.toLowerCase().includes(state.query) || p.desc.toLowerCase().includes(state.query)) );
  if(state.sort==='price-asc') list.sort((a,b)=>a.price-b.price);
  if(state.sort==='price-desc') list.sort((a,b)=>b.price-a.price);
  if(state.sort==='name') list.sort((a,b)=>a.name.localeCompare(b.name));

  list.forEach(p=>{
    const node = tpl.content.cloneNode(true);
    node.querySelector('.thumb').src = p.img;
    node.querySelector('.title').textContent = p.name;
    node.querySelector('.price').textContent = formatBRL(p.price);
    node.querySelector('.tag').textContent = p.cat.toUpperCase();
    node.querySelector('.desc').textContent = p.desc;
    node.querySelector('.add').addEventListener('click',()=> addToCart(p.id));
    node.querySelector('.view').addEventListener('click',()=> viewProduct(p));
    grid.appendChild(node);
  });

  updateCartUI();
}

function addToCart(id){
  state.cart[id] = (state.cart[id]||0)+1;
  updateCartUI();
}

function removeFromCart(id){
  delete state.cart[id];
  updateCartUI();
}

function changeQty(id,delta){
  state.cart[id] = (state.cart[id]||0)+delta;
  if(state.cart[id]<=0) delete state.cart[id];
  updateCartUI();
}

function updateCartUI(){
  const ids = Object.keys(state.cart);
  if(ids.length>0){cartCount.style.display='block'; cartCount.textContent = ids.reduce((s,i)=>s+state.cart[i],0)} else {cartCount.style.display='none'}
  cartItems.innerHTML='';
  let total = 0;
  ids.forEach(id=>{
    const p = products.find(x=>x.id==id);
    const qty = state.cart[id];
    const div = document.createElement('div'); div.className='cart-item';
    div.innerHTML = `<img src="${p.img}"/><div style="flex:1"><div style="font-weight:600">${p.name}</div><div style="color:#8b8b9a;font-size:13px">${formatBRL(p.price)} x ${qty}</div></div>`;
    const controls = document.createElement('div'); controls.style.display='flex'; controls.style.gap='6px';
    const plus = document.createElement('button'); plus.textContent='+'; plus.addEventListener('click',()=>changeQty(id,1));
    const minus = document.createElement('button'); minus.textContent='-'; minus.addEventListener('click',()=>changeQty(id,-1));
    const rem = document.createElement('button'); rem.textContent='Remover'; rem.className='secondary'; rem.addEventListener('click',()=>removeFromCart(id));
    controls.appendChild(plus); controls.appendChild(minus); controls.appendChild(rem);
    div.appendChild(controls);
    cartItems.appendChild(div);
    total += p.price * qty;
  });
  cartTotal.textContent = formatBRL(total);
}

function viewProduct(p){
  alert(p.name + "\n" + p.desc + "\nPreço: " + formatBRL(p.price));
}

document.querySelectorAll('.filter-btn').forEach(b=> b.addEventListener('click',()=>{state.cat=b.dataset.cat; render()}));
search.addEventListener('input',e=>{state.query=e.target.value.toLowerCase(); render()});
sort.addEventListener('change',e=>{state.sort=e.target.value; render()});

document.getElementById('openCart').addEventListener('click',()=>{cartDrawer.style.display='flex'});
document.getElementById('closeCart').addEventListener('click',()=>{cartDrawer.style.display='none'});
document.getElementById('clearCart').addEventListener('click',()=>{state.cart={}; updateCartUI()});
document.getElementById('checkoutBtn').addEventListener('click',()=>{
  if(Object.keys(state.cart).length===0){alert('Seu carrinho está vazio.'); return}
  const name = prompt('Nome para o pedido:');
  if(!name) return alert('Pedido cancelado.');
  alert('Obrigado, '+name+'! Pedido simulado realizado.');
  state.cart={}; updateCartUI(); cartDrawer.style.display='none';
});

render();

