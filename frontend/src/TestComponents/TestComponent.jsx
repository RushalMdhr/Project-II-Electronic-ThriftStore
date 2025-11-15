import { useState, useEffect } from "react";
import {
  useGetSoldOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../redux/api/orderApiSlice";
import { Link } from "react-router-dom";

// Dark, premium emerald palette
const COLORS = {
  emerald: "#009966",
  teal: "#23605C",
  slate: "#1E2939",
  black: "#101828",
  surface: "rgba(255,255,255,0.03)",
};

function fmtDate(d) {
  try {
    return new Date(d).toLocaleString();
  } catch (e) {
    return d;
  }
}

function sum(items = []) {
  return items.reduce((s, it) => s + (it.price || 0), 0);
}

export default function OrderManagement() {
  const { data: soldOrders } = useGetSoldOrdersQuery();
  const [updateOrder] = useUpdateOrderStatusMutation();

  const [selected, setSelected] = useState(null);
  const [mainConfirmAll, setMainConfirmAll] = useState(true);
  const [itemMap, setItemMap] = useState({}); // { itemId: boolean }
  const [rejectReasons, setRejectReasons] = useState({}); // { itemId: reason }

  // modals
  const [showRejectAllModal, setShowRejectAllModal] = useState(false);
  const [rejectAllDraft, setRejectAllDraft] = useState("");
  const [showItemModalFor, setShowItemModalFor] = useState(null); // itemId
  const [itemDraft, setItemDraft] = useState("");

  useEffect(() => {
    if (!selected) return;
    const map = {};
    selected.orderItems?.forEach((it) => (map[it._id] = true));
    setItemMap(map);
    setMainConfirmAll(true);
    setRejectReasons({});
    setRejectAllDraft("");
  }, [selected]);

  // logic: when accepting any (single or all) remove their reason
  function acceptItem(id) {
    setItemMap((p) => ({ ...p, [id]: true }));
    setRejectReasons((p) => {
      const c = { ...p };
      delete c[id];
      return c;
    });
    // if all items true -> main true
    setMainConfirmAll((prev) => {
      const next = { ...itemMap, [id]: true };
      return Object.values(next).every(Boolean);
    });
  }

  function attemptRejectItem(id) {
    // open modal to write reason then confirm
    setShowItemModalFor(id);
    setItemDraft("");
  }

  function confirmRejectItem() {
    if (!showItemModalFor) return;
    const id = showItemModalFor;
    setItemMap((p) => ({ ...p, [id]: false }));
    setRejectReasons((p) => ({ ...p, [id]: itemDraft || "No reason provided" }));
    setShowItemModalFor(null);
    setItemDraft("");
    setMainConfirmAll(false);
  }

  function cancelRejectItem() {
    setShowItemModalFor(null);
    setItemDraft("");
  }

  function attemptRejectAll() {
    setShowRejectAllModal(true);
    setRejectAllDraft("");
  }

  function confirmRejectAll() {
    const newMap = {};
    Object.keys(itemMap).forEach((k) => (newMap[k] = false));
    setItemMap(newMap);
    const reasons = {};
    Object.keys(itemMap).forEach((k) => (reasons[k] = rejectAllDraft || "No reason"));
    setRejectReasons(reasons);
    setShowRejectAllModal(false);
    setMainConfirmAll(false);
  }

  function cancelRejectAll() {
    setShowRejectAllModal(false);
    setRejectAllDraft("");
  }

  function handleMainToggle() {
    // if turning from true -> false, open modal
    if (mainConfirmAll) {
      attemptRejectAll();
      return;
    }
    // turning from false -> true: clear all reasons and set all true
    const newMap = {};
    Object.keys(itemMap).forEach((k) => (newMap[k] = true));
    setItemMap(newMap);
    setRejectReasons({});
    setMainConfirmAll(true);
  }

  async function handleSave() {
    if (!selected) return;
    const items = Object.keys(itemMap).map((id) => ({
      id,
      confirmed: !!itemMap[id],
      reason: itemMap[id] ? "" : rejectReasons[id] || "",
    }));
    const payload = {
      orderId: selected._id,
      items,
      overallStatus: Object.values(itemMap).every(Boolean) ? "confirmed" : "partial",
    };

    try {
      await updateOrder(payload).unwrap();
      // after success, clear local
      setSelected(null);
    } catch (e) {
      console.error(e);
      alert("Save failed — check console");
    }
  }

  function handleDiscard() {
    setSelected(null);
  }

  // UI helpers
  const headStyle = { background: COLORS.surface, color: "#E6F8F2" };

  return (
    <div style={{ background: COLORS.black }} className="min-h-screen p-6 text-white font-sans">
      <style>{`
        .card { background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.04); }
        .row:hover { transform: translateY(-6px); box-shadow: 0 10px 30px rgba(2,6,23,0.6); }
        .glass-switch { --w:52px; --h:30px; width:var(--w); height:var(--h); border-radius:calc(var(--h)/2); display:inline-flex; padding:4px; align-items:center; cursor:pointer; box-shadow: inset 0 1px 0 rgba(255,255,255,0.02); backdrop-filter: blur(6px) saturate(120%); }
        .glass-thumb { width:22px; height:22px; border-radius:50%; background: linear-gradient(180deg, #fff, #f6f6f6); box-shadow: 0 2px 8px rgba(2,6,23,0.6); transition: transform .22s cubic-bezier(.2,.9,.3,1); }
        .glass-switch.on { background: linear-gradient(90deg, rgba(0,153,102,0.12), rgba(35,96,92,0.06)); border: 1px solid rgba(0,153,102,0.18); }
        .glass-switch.off { background: linear-gradient(90deg, rgba(220,38,38,0.06), rgba(30,41,59,0.04)); border: 1px solid rgba(220,38,38,0.12); }
        .glass-switch.on .glass-thumb { transform: translateX(22px); }

        .badge-pending { background: rgba(255,255,255,0.04); border: 1px dashed rgba(255,255,255,0.06); color: ${COLORS.emerald}; padding:6px 10px; border-radius:999px; font-weight:700; display:inline-block; }

        .head-cell { padding:14px 12px; text-align:left; font-weight:700; letter-spacing:0.6px; color:#DFF6EE; }
        .cell { padding:12px; border-bottom: 1px solid rgba(255,255,255,0.03); }

      `}</style>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex items-center gap-3">
          <div className="badge-pending">Pending</div>
          <button className="px-4 py-2 rounded-md font-semibold" style={{ background: COLORS.emerald, color: "#061114" }}>
            + New
          </button>
        </div>
      </div>

      <div className="card rounded-xl overflow-hidden">
        <table className="w-full table-auto">
          <thead style={headStyle}>
            <tr>
              <th className="head-cell">Order</th>
              <th className="head-cell">Date</th>
              <th className="head-cell">Customer</th>
              <th className="head-cell">Payment</th>
              <th className="head-cell">Status</th>
              <th className="head-cell">Total</th>
              <th className="head-cell">Action</th>
            </tr>
          </thead>

          <tbody>
            {soldOrders?.map((o) => (
              <tr key={o._id} className="row" style={{ transition: "all .12s" }}>
                <td className="cell">{o._id?.slice(0, 8)}...</td>
                <td className="cell">{fmtDate(o.createdAt)}</td>
                <td className="cell">{o.customer}</td>
                <td className="cell">
                  <div className="text-sm">
                    <div>{o.payment?.method}</div>
                    <div style={{ color: "#FFD580", fontWeight: 700 }}>{o.payment?.status}</div>
                  </div>
                </td>
                <td className="cell">{o.status === 'pending' ? <span style={{ padding: '6px 10px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)' }} className="text-xs font-semibold">PENDING</span> : <span className="text-sm">{o.status}</span>}</td>
                <td className="cell">Rs. {sum(o.orderItems)}</td>
                <td className="cell">
                  <button onClick={() => setSelected(o)} className="px-3 py-1 rounded-md font-semibold" style={{ background: COLORS.emerald, color: '#061114' }}>
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAILS MODAL - DARK CLEAN */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={handleDiscard} />

          <div className="relative w-full max-w-3xl p-6 rounded-2xl card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold">Order {selected._id?.slice(0, 8)}...</h2>
                <div className="text-sm opacity-80">{fmtDate(selected.createdAt)}</div>
              </div>

              <div className="flex items-center gap-4">
                <div style={{ textAlign: 'right' }}>
                  <div className="text-xs opacity-80">Overall</div>
                  <div className="font-semibold">{mainConfirmAll ? 'All confirmed' : 'Has rejection'}</div>
                </div>

                <div role="button" className={`glass-switch ${mainConfirmAll ? 'on' : 'off'}`} onClick={handleMainToggle}>
                  <div className="glass-thumb" />
                </div>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-auto pr-3">
              {selected.orderItems.map((it) => (
                <div key={it._id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: COLORS.black, border: '1px solid rgba(255,255,255,0.02)' }}>
                  <div>
                    <div className="font-semibold">{it.product.name}</div>
                    <div className="text-sm opacity-70">qty: {it.quantity} • Rs. {it.price}</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div style={{ minWidth: 150 }} className="flex items-center gap-3">
                      <div role="button" className={`glass-switch ${itemMap[it._id] ? 'on' : 'off'}`} onClick={() => (itemMap[it._id] ? attemptRejectItem(it._id) : acceptItem(it._id))}>
                        <div className="glass-thumb" />
                      </div>

                      <div className={itemMap[it._id] ? 'text-green-300 font-semibold' : 'text-red-300 font-semibold'}>
                        {itemMap[it._id] ? 'Confirmed' : 'Rejected'}
                      </div>
                    </div>

                    {/* show reason pill if rejected */}
                    {!itemMap[it._id] && (
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.03)' }}>
                        <div className="text-xs opacity-70">Reason</div>
                        <div className="text-sm font-medium">{rejectReasons[it._id]}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={handleDiscard} className="px-4 py-2 rounded-md" style={{ background: COLORS.black }}>
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 rounded-md font-semibold" style={{ background: COLORS.emerald, color: '#061114' }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject All Modal */}
      {showRejectAllModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={cancelRejectAll} />
          <div className="relative w-full max-w-md p-6 rounded-xl card">
            <h3 className="text-lg font-bold mb-2">Reject All — Provide reason</h3>
            <textarea value={rejectAllDraft} onChange={(e) => setRejectAllDraft(e.target.value)} placeholder="Reason for rejecting all items" className="w-full p-3 rounded-md text-black" />
            <div className="flex justify-end gap-3 mt-3">
              <button onClick={cancelRejectAll} className="px-3 py-1 rounded-md">Cancel</button>
              <button onClick={confirmRejectAll} className="px-3 py-1 rounded-md font-semibold" style={{ background: COLORS.emerald, color: '#061114' }}>Confirm Reject All</button>
            </div>
          </div>
        </div>
      )}

      {/* Individual Item Modal */}
      {showItemModalFor && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={cancelRejectItem} />
          <div className="relative w-full max-w-md p-6 rounded-xl card">
            <h3 className="text-lg font-bold mb-2">Reject Item — Provide reason</h3>
            <textarea value={itemDraft} onChange={(e) => setItemDraft(e.target.value)} placeholder="Reason for rejecting this item" className="w-full p-3 rounded-md text-black" />
            <div className="flex justify-end gap-3 mt-3">
              <button onClick={cancelRejectItem} className="px-3 py-1 rounded-md">Cancel</button>
              <button onClick={confirmRejectItem} className="px-3 py-1 rounded-md font-semibold" style={{ background: COLORS.emerald, color: '#061114' }}>Reject Item</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// CSS FIXES
// 1) Shorten ID to last 6 chars.
// 2) Format date as `Nov-2025, Mon`.
// 3) Payment badges: pending = #FFD500, paid = green.
// 4) Details modal: lower backdrop transparency + brighter panel.
// 5) Reject modal text color fixed for visibility.

