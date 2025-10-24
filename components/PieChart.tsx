import React from 'react';

interface PieChartProps {
  data: Record<string, number>;
  colors: Record<string, string>;
}

const getPathForArc = (startAngle: number, endAngle: number, radius: number) => {
    const x1 = radius + radius * Math.cos(startAngle);
    const y1 = radius + radius * Math.sin(startAngle);
    const x2 = radius + radius * Math.cos(endAngle);
    const y2 = radius + radius * Math.sin(endAngle);

    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

    return [
        'M', radius, radius,
        'L', x1, y1,
        'A', radius, radius, 0, largeArcFlag, 1, x2, y2,
        'Z'
    ].join(' ');
};

const PieChart: React.FC<PieChartProps> = ({ data, colors }) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);

    if (total === 0) {
        return <div className="text-center text-slate-500 py-8 h-[264px] flex items-center justify-center">Sem dados para exibir o gráfico.</div>;
    }

    let startAngle = 0;
    const radius = 50;
    const viewBoxSize = radius * 2;

    const slices = Object.entries(data).map(([key, value]) => {
        const percentage = value / total;
        const angle = percentage * 2 * Math.PI;
        const endAngle = startAngle + angle;

        const pathData = getPathForArc(startAngle, endAngle, radius);
        startAngle = endAngle;

        return {
            key: key,
            value,
            percentage: (percentage * 100).toFixed(1),
            pathData,
            color: colors[key] || '#94a3b8', // slate-400 for fallback
        };
    });

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-4 bg-white rounded-lg border border-slate-200 h-full">
            <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} width="150" height="150" className="transform -rotate-90">
                {slices.map(slice => (
                    <path key={slice.key} d={slice.pathData} fill={slice.color} />
                ))}
            </svg>
            <div className="space-y-2">
                {slices.map(slice => (
                     <div key={slice.key} className="flex items-center text-sm">
                        <span className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: slice.color }}></span>
                        <span className="font-semibold text-slate-700 w-28">{slice.key}:</span>
                        <span className="text-slate-600">{slice.percentage}%</span>
                     </div>
                ))}
            </div>
        </div>
    );
};

export default PieChart;