import React, { useState, useEffect } from "react";
import {
  Search, X, Plus, Minus, Trash2, Pencil, AlertTriangle, Store,
  Cookie, Package, CupSoda, Wheat, Droplets, Home as HomeIcon, Smartphone
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Global styles                                                        */
/* ------------------------------------------------------------------ */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap');
      .ts-root { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
      .ts-display { font-family: 'Baloo 2', ui-sans-serif, system-ui, sans-serif; }
      .ts-mono { font-family: 'Space Mono', ui-monospace, monospace; }
      .ts-focus:focus-visible { outline: 2px solid #16a34a; outline-offset: 2px; }
      .ts-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
      .ts-scroll::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 999px; }
      .ts-toast { animation: ts-toast-in 0.2s ease-out; }
      @keyframes ts-toast-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
    `}</style>
  );
}

/* ------------------------------------------------------------------ */
/* Store info + data                                                    */
/* ------------------------------------------------------------------ */
const STORE = { name: "Sari-Sari Store" };

const CATEGORY_META = {
  "Snacks & Chichirya": { icon: Cookie, grad: "from-orange-500 to-red-600" },
  "Canned & Instant Goods": { icon: Package, grad: "from-stone-500 to-stone-700" },
  Beverages: { icon: CupSoda, grad: "from-sky-500 to-blue-600" },
  "Rice & Staples": { icon: Wheat, grad: "from-amber-400 to-yellow-600" },
  "Toiletries (Tingi)": { icon: Droplets, grad: "from-teal-400 to-cyan-600" },
  "Household Items": { icon: HomeIcon, grad: "from-violet-500 to-purple-600" },
  "Load & Bills Payment": { icon: Smartphone, grad: "from-emerald-500 to-green-600" },
};
const CATEGORIES = Object.keys(CATEGORY_META);

const INITIAL_PRODUCTS = [
  { id: "lucky-me-canton", name: "Lucky Me! Pancit Canton Chilimansi", category: "Canned & Instant Goods", unit: "per pack (55g)", price: 15, promoPrice: null, stock: 45 },
  { id: "argentina-corned-beef", name: "Argentina Corned Beef 150g", category: "Canned & Instant Goods", unit: "per can", price: 48, promoPrice: null, stock: 30 },
  { id: "piattos-cheese", name: "Piattos Cheese 40g", category: "Snacks & Chichirya", unit: "per pack", price: 22, promoPrice: 18, stock: 5 },
  { id: "skyflakes", name: "SkyFlakes Crackers (10s)", category: "Snacks & Chichirya", unit: "per pack", price: 35, promoPrice: null, stock: 20 },
  { id: "coke-1-5l", name: "Coca-Cola 1.5L", category: "Beverages", unit: "per bottle", price: 65, promoPrice: 60, stock: 18 },
  { id: "kopiko-3in1", name: "Kopiko 3-in-1 Coffee", category: "Beverages", unit: "per sachet", price: 9, promoPrice: null, stock: 60 },
  { id: "bigas", name: "Bigas (1 kilo)", category: "Rice & Staples", unit: "per kilo", price: 58, promoPrice: null, stock: 8 },
  { id: "itlog", name: "Itlog (Eggs)", category: "Rice & Staples", unit: "per piece", price: 9, promoPrice: null, stock: 40 },
  { id: "datu-puti", name: "Datu Puti Suka / Toyo 350ml", category: "Rice & Staples", unit: "per bottle", price: 28, promoPrice: null, stock: 15 },
  { id: "safeguard", name: "Safeguard Bar Soap", category: "Toiletries (Tingi)", unit: "per bar", price: 24, promoPrice: null, stock: 22 },
  { id: "sunsilk-sachet", name: "Sunsilk Shampoo", category: "Toiletries (Tingi)", unit: "per sachet", price: 7, promoPrice: null, stock: 50 },
  { id: "candles", name: "Candles", category: "Household Items", unit: "per piece", price: 6, promoPrice: null, stock: 0 },
  { id: "load-50", name: "Prepaid Load ₱50", category: "Load & Bills Payment", unit: "load value", price: 50, promoPrice: null, stock: 999 },
];

const money = (n) => `₱${Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const effectivePrice = (p) => (p.promoPrice != null ? p.promoPrice : p.price);
const stockStatusFor = (qty) => (qty <= 0 ? "Wala munang stock" : qty < 10 ? "Paubos na" : "Available");

/* ------------------------------------------------------------------ */
/* Small atoms                                                          */
/* ------------------------------------------------------------------ */
function CategoryTile({ category, className = "" }) {
  const meta = CATEGORY_META[category] || CATEGORY_META["Snacks & Chichirya"];
  const Icon = meta.icon;
  return (
    <div className={`flex items-center justify-center rounded-xl bg-gradient-to-br ${meta.grad} ${className}`}>
      <Icon className="text-white/90" size={32} strokeWidth={1.6} />
    </div>
  );
}

function StockBadge({ qty }) {
  const status = stockStatusFor(qty);
  const styles = {
    Available: "bg-green-50 text-green-700 ring-green-200",
    "Paubos na": "bg-amber-50 text-amber-700 ring-amber-200",
    "Wala munang stock": "bg-stone-100 text-stone-500 ring-stone-200",
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${styles[status]}`}>{status}</span>;
}

function ConfirmModal({ title, message, confirmLabel = "Kumpirmahin", danger = false, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-2 flex items-center gap-2">
          <AlertTriangle size={18} className={danger ? "text-red-500" : "text-amber-500"} />
          <h3 className="ts-display text-base font-semibold text-stone-900">{title}</h3>
        </div>
        <p className="mb-5 text-sm text-stone-600">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="ts-focus rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50">Kanselahin</button>
          <button onClick={onConfirm} className={`ts-focus rounded-lg px-4 py-2 text-sm font-medium text-white ${danger ? "bg-red-600 hover:bg-red-700" : "bg-green-700 hover:bg-green-800"}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                                */
/* ------------------------------------------------------------------ */
function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-700"><Store size={18} className="text-white" /></span>
        <div>
          <p className="ts-display text-sm font-bold leading-tight text-stone-900">{STORE.name}</p>
          <p className="text-[11px] leading-tight text-stone-400">Listahan ng Paninda</p>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Product form modal                                                   */
/* ------------------------------------------------------------------ */
function ProductFormModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || { name: "", category: CATEGORIES[0], unit: "per piece", price: "", promoPrice: "", stock: "" });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4">
      <div className="ts-scroll max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="ts-display text-lg font-semibold text-stone-900">{initial ? "I-edit ang Paninda" : "Magdagdag ng Paninda"}</h3>
          <button onClick={onClose} className="ts-focus rounded-lg p-1.5 text-stone-500 hover:bg-stone-100"><X size={18} /></button>
        </div>
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">Pangalan ng paninda</label>
            <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="ts-focus w-full rounded-lg border border-stone-200 px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-500">Kategorya</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="ts-focus w-full rounded-lg border border-stone-200 px-3 py-2 text-sm">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-500">Unit (hal. per piece)</label>
              <input value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} className="ts-focus w-full rounded-lg border border-stone-200 px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-500">Presyo (₱)</label>
              <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="ts-focus w-full rounded-lg border border-stone-200 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-500">Promo price (opsyonal)</label>
              <input type="number" min="0" step="0.01" value={form.promoPrice} onChange={(e) => setForm((f) => ({ ...f, promoPrice: e.target.value }))} className="ts-focus w-full rounded-lg border border-stone-200 px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">Dami sa Stock</label>
            <input required type="number" min="0" step="1" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} className="ts-focus w-full rounded-lg border border-stone-200 px-3 py-2 text-sm" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="ts-focus rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50">Kanselahin</button>
            <button type="submit" className="ts-focus rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">I-save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Product list manager                                                 */
/* ------------------------------------------------------------------ */
function InventoryView({ products, setProducts, setToast }) {
  const [category, setCategory] = useState("Lahat");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = products.filter((p) => {
    if (category !== "Lahat" && p.category !== category) return false;
    if (query.trim() && !p.name.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });

  const saveProduct = (form) => {
    const payload = {
      name: form.name, category: form.category, unit: form.unit || "per piece",
      price: Number(form.price), promoPrice: form.promoPrice ? Number(form.promoPrice) : null,
      stock: Math.max(0, Number(form.stock) || 0),
    };
    if (modal.mode === "edit") {
      setProducts((ps) => ps.map((p) => (p.id === modal.product.id ? { ...p, ...payload } : p)));
      setToast("Na-update ang paninda.");
    } else {
      const id = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).slice(2, 6);
      setProducts((ps) => [{ id, ...payload }, ...ps]);
      setToast("Naidagdag ang paninda.");
    }
    setModal(null);
  };

  const adjustStock = (id, delta) => {
    setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="ts-display text-xl font-semibold text-stone-900">Mga Paninda</h1>
        <button onClick={() => setModal({ mode: "add" })} className="ts-focus flex items-center gap-1.5 rounded-lg bg-stone-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-stone-700"><Plus size={15} /> Magdagdag</button>
      </div>

      <div className="mb-3 flex items-center gap-2 rounded-xl border border-stone-200 bg-white p-2">
        <Search size={16} className="ml-1 text-stone-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Maghanap ng paninda..." className="ts-focus flex-1 bg-transparent px-1 py-1 text-sm outline-none" />
      </div>
      <div className="ts-scroll mb-4 flex gap-1.5 overflow-x-auto pb-1">
        {["Lahat", ...CATEGORIES].map((c) => (
          <button key={c} onClick={() => setCategory(c)} className={`ts-focus shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${category === c ? "bg-stone-900 text-white" : "border border-stone-200 text-stone-600 hover:bg-stone-50"}`}>{c}</button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-stone-200">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-400">
            <tr>
              <th className="px-4 py-2.5 font-medium">Paninda</th>
              <th className="px-4 py-2.5 font-medium">Kategorya</th>
              <th className="px-4 py-2.5 font-medium">Presyo</th>
              <th className="px-4 py-2.5 font-medium">Stock</th>
              <th className="px-4 py-2.5 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className="flex items-center gap-2 px-4 py-3">
                  <CategoryTile category={p.category} className="h-8 w-8 rounded-md" />
                  <span className="font-medium text-stone-700">{p.name}</span>
                </td>
                <td className="px-4 py-3 text-stone-500">{p.category}</td>
                <td className="ts-mono px-4 py-3 font-semibold text-green-700">
                  {p.promoPrice != null && <span className="mr-1.5 text-stone-400 line-through">{money(p.price)}</span>}
                  {money(effectivePrice(p))}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => adjustStock(p.id, -1)} className="ts-focus flex h-6 w-6 items-center justify-center rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50"><Minus size={12} /></button>
                    <span className="ts-mono w-6 text-center text-sm">{p.stock}</span>
                    <button onClick={() => adjustStock(p.id, 1)} className="ts-focus flex h-6 w-6 items-center justify-center rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50"><Plus size={12} /></button>
                    <StockBadge qty={p.stock} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => setModal({ mode: "edit", product: p })} className="ts-focus rounded-lg p-1.5 text-stone-500 hover:bg-stone-100"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteTarget(p)} className="ts-focus rounded-lg p-1.5 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-8 text-center text-sm text-stone-400">Walang paninda na nahanap.</p>}
      </div>

      {modal && (
        <ProductFormModal
          initial={modal.mode === "edit" ? { name: modal.product.name, category: modal.product.category, unit: modal.product.unit, price: modal.product.price, promoPrice: modal.product.promoPrice ?? "", stock: modal.product.stock } : null}
          onClose={() => setModal(null)}
          onSave={saveProduct}
        />
      )}
      {deleteTarget && (
        <ConfirmModal
          title="Tanggalin ang paninda?"
          message={`Tatanggalin si "${deleteTarget.name}" sa listahan. Hindi na ito maibabalik.`}
          confirmLabel="Tanggalin"
          danger
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => { setProducts((ps) => ps.filter((p) => p.id !== deleteTarget.id)); setDeleteTarget(null); setToast("Natanggal ang paninda."); }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                    */
/* ------------------------------------------------------------------ */
export default function App() {
  const [products, setProducts] = useState(() => {
  const saved = localStorage.getItem("products");

  if (saved) {
    return JSON.parse(saved);
  }

  return INITIAL_PRODUCTS;
});
  const [toast, setToast] = useState(null);

  useEffect(() => { document.title = STORE.name; }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
  localStorage.setItem("products", JSON.stringify(products));
}, [products]);

  return (
    <div className="ts-root min-h-screen bg-stone-50">
      <GlobalStyles />
      <Header />

      {toast && (
        <div className="ts-toast fixed left-1/2 top-16 z-50 -translate-x-1/2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      <InventoryView products={products} setProducts={setProducts} setToast={setToast} />
    </div>
  );
}
