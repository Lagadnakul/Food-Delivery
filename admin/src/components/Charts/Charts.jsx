import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444']

// ─── Revenue Area Chart ───────────────────────────────────────────────────────
export const RevenueChart = ({ orders }) => {
  // Group orders by day (last 7 days)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return {
      date: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
      revenue: 0,
      orders: 0,
    }
  })

  orders.forEach(order => {
    const orderDate = new Date(order.createdAt)
    last7.forEach(day => {
      const dayDate = new Date(day.date)
      if (
        orderDate.getDate() === dayDate.getDate() &&
        orderDate.getMonth() === dayDate.getMonth()
      ) {
        day.revenue += order.amount || 0
        day.orders += 1
      }
    })
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Revenue — Last 7 Days</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={last7}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }}
            formatter={(v) => [`₹${v}`, 'Revenue']}
          />
          <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} fill="url(#revenueGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── Orders Bar Chart ─────────────────────────────────────────────────────────
export const OrdersBarChart = ({ orders }) => {
  const statusData = [
    { name: 'Processing', value: orders.filter(o => o.status === 'Food Processing').length, color: '#f59e0b' },
    { name: 'Out for Delivery', value: orders.filter(o => o.status === 'Out for Delivery').length, color: '#3b82f6' },
    { name: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, color: '#10b981' },
    { name: 'Pending', value: orders.filter(o => !o.status || o.status === 'pending').length, color: '#94a3b8' },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Orders by Status</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={statusData} barSize={36}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }}
            cursor={{ fill: '#f8fafc' }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Orders">
            {statusData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── Category Pie Chart ───────────────────────────────────────────────────────
export const CategoryPieChart = ({ foodItems }) => {
  const grouped = foodItems.reduce((acc, item) => {
    const cat = item.category || 'Other'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {})

  const data = Object.entries(grouped).map(([name, value]) => ({ name, value }))

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center h-[280px]">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Menu by Category</h3>
        <p className="text-slate-400 text-sm">No food items yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Menu by Category</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={3}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }}
          />
          <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
