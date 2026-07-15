import './index.css';

const services = [
  { name: 'EC2', alt: 'Docker Containers', icon: '💻', status: 'Running' },
  { name: 'S3', alt: 'MinIO', icon: '🪣', status: 'Running' },
  { name: 'IAM', alt: 'Custom JWT', icon: '🔑', status: 'Running' },
  { name: 'VPC', alt: 'Docker Networks', icon: '🌐', status: 'Running' },
  { name: 'EBS', alt: 'Docker Volumes', icon: '💾', status: 'Running' },
  { name: 'RDS', alt: 'Managed Postgres/MySQL', icon: '🗄️', status: 'Running' },
  { name: 'Lambda', alt: 'OpenFaaS', icon: '⚡', status: 'Running' },
  { name: 'API Gateway', alt: 'Traefik', icon: '🚪', status: 'Running' },
  { name: 'CloudWatch', alt: 'Prometheus & Grafana', icon: '📈', status: 'Running' },
  { name: 'DynamoDB', alt: 'MongoDB / Redis', icon: '📑', status: 'Running' },
  { name: 'SNS / SQS', alt: 'RabbitMQ', icon: '📬', status: 'Running' },
  { name: 'ECS / ECR', alt: 'Local Registry', icon: '🐋', status: 'Running' },
  { name: 'Route 53', alt: 'CoreDNS', icon: '🧭', status: 'Running' },
];

function App() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
          VNAV Cloud v2
        </h1>
        <p className="text-slate-400 text-lg">Your Raspberry Pi AWS Alternative</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((svc) => (
          <div key={svc.name} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800 transition-colors cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{svc.icon}</span>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-medium">
                {svc.status}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-1 group-hover:text-blue-400 transition-colors">{svc.name}</h3>
            <p className="text-slate-500 text-sm">{svc.alt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
