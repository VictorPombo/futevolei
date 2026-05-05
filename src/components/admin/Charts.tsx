'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { DATA } from '@/lib/mockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

ChartJS.defaults.color = '#8B90B8';
ChartJS.defaults.font.family = "'DM Mono', monospace";
ChartJS.defaults.plugins.tooltip.backgroundColor = 'rgba(17,17,32,0.9)';
ChartJS.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.1)';
ChartJS.defaults.plugins.tooltip.borderWidth = 1;
ChartJS.defaults.plugins.tooltip.titleFont = { family: 'Syne', size: 14 };

export function GrowthChart() {
  const data = {
    labels: DATA.crescimentoMensal.map(d => d.mes),
    datasets: [{
      data: DATA.crescimentoMensal.map(d => d.atletas),
      borderColor: '#E8833A',
      backgroundColor: 'rgba(232, 131, 58, 0.2)', // simplified gradient
      fill: true,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: '#E8833A'
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' } },
      x: { grid: { display: false } }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Line data={data} options={options as any} />;
}

export function StatusDonut() {
  const data = {
    labels: ['Em Andamento', 'Abertos', 'Rascunho', 'Finalizados'],
    datasets: [{
      data: [6, 5, 3, 18],
      backgroundColor: ['#22C55E', '#38BDF8', '#F59E0B', '#4A4D6A'],
      borderWidth: 0
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: { legend: { display: false } }
  };

  return <Doughnut data={data} options={options} />;
}

export function LevelsDonut() {
  const data = {
    labels: ['Profissional', 'Amador A', 'Amador B', 'Amador C', 'Iniciante', 'Aprendiz'],
    datasets: [{
      data: [12, 48, 143, 312, 245, 87],
      backgroundColor: ['#E8833A', '#F59E0B', '#8B5CF6', '#38BDF8', '#22C55E', '#6B7280'],
      borderWidth: 0
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: { legend: { display: false } }
  };

  return <Doughnut data={data} options={options} />;
}

export function RevenueBars() {
  const data = {
    labels: DATA.projecaoReceita.slice(0, 6).map(d => d.mes),
    datasets: [{
      label: 'Projeção (R$)',
      data: DATA.projecaoReceita.slice(0, 6).map(d => d.real || d.otimista),
      backgroundColor: '#F59E0B',
      borderRadius: 4
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' } },
      x: { grid: { display: false } }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Bar data={data} options={options as any} />;
}

export function RevenueLines() {
  const data = {
    labels: DATA.projecaoReceita.map(d => d.mes),
    datasets: [
      {
        label: 'Receita Real',
        data: DATA.projecaoReceita.map(d => d.real),
        borderColor: '#22C55E',
        backgroundColor: 'rgba(34,197,94,0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Otimista',
        data: DATA.projecaoReceita.map(d => d.otimista),
        borderColor: '#F59E0B',
        borderDash: [5, 5],
        tension: 0.4,
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' } },
      x: { grid: { display: false } }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Line data={data} options={options as any} />;
}

export function StatesBar() {
  const data = {
    labels: ['SP', 'RJ', 'MG', 'PR', 'BA'],
    datasets: [{
      data: [8, 4, 3, 2, 1],
      backgroundColor: '#38BDF8',
      borderRadius: 4
    }]
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { grid: { display: false } }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Bar data={data} options={options as any} />;
}
