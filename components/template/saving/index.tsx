'use client';

import React from 'react';
import SaveCard from '@/components/molecules/cards/SaveCard';
import { Share2, ChevronDown, HeartPulse, ShoppingBag, Home, Tent, Utensils, Plane, PiggyBank } from 'lucide-react';
import { useSavings } from '@/context/SavingsContext';
import { useAuth } from '@/context/AuthContext';
import { CATEGORIES } from '@/utils/JSONObjects';

// Helper to map category ID to colors and icons
const getCategoryStyle = (categoryId: number) => {
  switch (categoryId) {
    case 1: // Hogar y Servicios
      return { color: "bg-purple-400", textColor: "text-purple-400", icon: Home };
    case 2: // Entretenimiento
      return { color: "bg-pink-500", textColor: "text-pink-500", icon: ShoppingBag };
    case 3: // Gastronomía
      return { color: "bg-orange-500", textColor: "text-orange-500", icon: Utensils };
    case 4: // Salud y Bienestar
      return { color: "bg-teal-400", textColor: "text-teal-400", icon: HeartPulse };
    case 5: // Turismo
      return { color: "bg-blue-500", textColor: "text-blue-500", icon: Plane };
    case 6: // Ropa y Accesorios
      return { color: "bg-green-500", textColor: "text-green-500", icon: ShoppingBag };
    default:
      return { color: "bg-gray-400", textColor: "text-gray-400", icon: PiggyBank };
  }
};

const MySavingsTemplate = () => {
  const { data, loading, updateRange, currentMonths } = useSavings();
  const { state: authState } = useAuth();

  // Determine user name
  const userName = authState.user
    ? `${authState.user.first_name || ''} ${authState.user.last_name || ''}`.trim()
    : data.cliente
    ? `${data.cliente.nombres || ''} ${data.cliente.apellidos || ''}`.trim()
    : 'Socio';

  const totalSaved = data.cliente?.ahorroTotal ?? 0;
  const formattedTotal = `$ ${totalSaved.toLocaleString('es-CO')}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Mis Ahorros - Club Vivamos',
        text: `¡He ahorrado ${formattedTotal} con el Club EL TIEMPO Vivamos!`,
        url: window.location.href,
      }).catch((err) => console.log('Error sharing:', err));
    } else {
      alert(`¡Has ahorrado ${formattedTotal} con el Club EL TIEMPO Vivamos!`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-barlow bg-gray-50/30 relative">
      
      {/* Loading overlay for transitions */}
      {loading && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-[#0f092d] text-white px-4 py-2 rounded-full shadow-lg text-xs font-semibold animate-pulse">
            Actualizando datos...
          </div>
        </div>
      )}

      <main className="flex-grow pb-16">

        {/* =========================================
            SECCIÓN 1: Cabecera Oscura (Resumen)
            ========================================= */}
        <section className="bg-[#0f092d] text-white w-full py-10">
          <div className="max-w-4xl mx-auto px-6 relative flex flex-col items-center">
            
            {/* Controles Superiores (Periodo y Compartir) */}
            <div className="w-full flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <select 
                  value={currentMonths} 
                  onChange={(e) => updateRange(Number(e.target.value))}
                  disabled={loading}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-md px-3 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer transition"
                >
                  <option value="6" className="bg-[#0f092d] text-white">Últimos 6 meses</option>
                  <option value="12" className="bg-[#0f092d] text-white">Últimos 12 meses</option>
                </select>
              </div>
              
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition px-4 py-1.5 rounded-full text-xs font-semibold"
              >
                Compartir <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Total Ahorrado */}
            <div className="text-center flex flex-col gap-1">
              <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wide">{userName}</h1>
              <p className="text-sm text-gray-300 font-medium">Con el Club EL TIEMPO Vivamos has ahorrado</p>
              <h2 className="text-4xl md:text-5xl font-bold text-orange-400 mt-2 tracking-tight">
                {formattedTotal}
              </h2>
            </div>

          </div>
        </section>

        {/* =========================================
            SECCIÓN 2: Aliados que más usaste
            ========================================= */}
        <section className="max-w-5xl mx-auto px-4 md:px-6 mt-12 mb-16">
          <h2 className="text-lg md:text-xl font-bold text-[#03091e] mb-6">Aliados que más usaste</h2>
          
          <div className="flex overflow-x-auto pb-4 gap-4 md:gap-6 hide-scrollbar">
            {data.utilizacionesPorAliados && data.utilizacionesPorAliados.length > 0 ? (
              data.utilizacionesPorAliados.map((item, index) => {
                // Simple logo mapping
                const cleanName = item.aliadoName.toLowerCase().replace(/[^a-z0-9]/g, '');
                const logoUrl = `/logos/${cleanName}.png`;
                
                return (
                  <SaveCard 
                    key={item.aliadoName}
                    rank={index + 1}
                    logoUrl={logoUrl}
                    brandName={item.aliadoName}
                    savedAmount={`$ ${item.ahorro.toLocaleString('es-CO')}`}
                    usageCount={item.cantidadUtilizaciones}
                    category="Aliado"
                    categoryColor="bg-teal-400"
                  />
                );
              })
            ) : (
              <div className="w-full text-center py-10 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <p className="text-gray-500 font-semibold mb-2">Aún no registras ahorros en este periodo.</p>
                <p className="text-xs text-gray-400">¡Usa los beneficios del Club para ver tus estadísticas aquí!</p>
              </div>
            )}
          </div>
        </section>

        {/* =========================================
            SECCIÓN 3: Categorías que más usaste (Gráficos)
            ========================================= */}
        <section className="max-w-5xl mx-auto px-4 md:px-6 mb-12">
          <h2 className="text-lg md:text-xl font-bold text-[#03091e] mb-8">Categorías que más usaste</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            
            {/* Lado Izquierdo: Gráfico circular o indicador total */}
            <div className="flex flex-col items-center justify-center relative bg-white border border-gray-100 rounded-2xl p-8 shadow-sm h-64">
              <PiggyBank className="w-16 h-16 text-orange-400 mb-4 stroke-1" />
              <span className="text-sm font-semibold text-gray-500">Total acumulado en el periodo</span>
              <span className="text-2xl font-bold text-[#03091e] mt-1">{formattedTotal}</span>
            </div>

            {/* Lado Derecho: Tabla de Categorías (Leyenda) */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
              {data.categoriasPorcentaje && data.categoriasPorcentaje.length > 0 ? (
                data.categoriasPorcentaje.map((item) => {
                  const cat = CATEGORIES.find((c) => c.id === item.categoriaId);
                  const title = cat ? cat.title : `Categoría ${item.categoriaId}`;
                  const style = getCategoryStyle(item.categoriaId);
                  const Icon = style.icon;

                  return (
                    <div key={item.categoriaId} className="flex border-b border-gray-100 last:border-b-0">
                      <div className="w-2/3 flex items-center gap-3 px-4 py-3 bg-gray-50/50">
                        <div className={`w-1.5 h-10 ${style.color} rounded-full`}></div>
                        <Icon className={`w-5 h-5 ${style.textColor}`} />
                        <span className="text-sm font-bold text-gray-700">{title}</span>
                      </div>
                      <div className="w-1/3 flex items-center justify-center bg-white font-bold text-[#03091e]">
                        {item.porcentaje}%
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 bg-white p-6">
                  <p className="text-gray-400 text-xs font-semibold">Sin distribución de categorías en este periodo.</p>
                </div>
              )}
            </div>

          </div>

          <p className="text-[11px] text-gray-400 mt-8 text-center md:text-left">
            *La información y valores entregados son aproximados, sujetos a reportes entregados por los aliados.
          </p>
        </section>

      </main>
    </div>
  );
}

export default MySavingsTemplate;
