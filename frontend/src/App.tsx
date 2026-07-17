import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Billing } from './pages/Billing';
import { EC2 } from './pages/compute/EC2';
import { S3 } from './pages/storage/S3';
import { EBS } from './pages/storage/EBS';
import { RDS } from './pages/storage/RDS';
import { DynamoDB } from './pages/storage/DynamoDB';
import { Lambda } from './pages/compute/Lambda';
import { Containers } from './pages/compute/Containers';
import { VPC } from './pages/networking/VPC';
import { APIGateway } from './pages/networking/APIGateway';
import { IAM } from './pages/security/IAM';
import { Monitoring } from './pages/tools/Monitoring';
import { Marketplace } from './pages/tools/Marketplace';
import { Terminal } from './pages/tools/Terminal';
import { Files } from './pages/tools/Files';
import { AI } from './pages/tools/AI';
import { Settings } from './pages/tools/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="billing" element={<Billing />} />
          <Route path="compute/ec2" element={<EC2 />} />
          <Route path="compute/lambda" element={<Lambda />} />
          <Route path="compute/containers" element={<Containers />} />
          
          <Route path="storage/s3" element={<S3 />} />
          <Route path="storage/ebs" element={<EBS />} />
          <Route path="storage/rds" element={<RDS />} />
          <Route path="storage/dynamodb" element={<DynamoDB />} />
          
          <Route path="networking/vpc" element={<VPC />} />
          <Route path="networking/gateway" element={<APIGateway />} />
          <Route path="security/iam" element={<IAM />} />
          
          <Route path="tools/monitoring" element={<Monitoring />} />
          <Route path="tools/marketplace" element={<Marketplace />} />
          <Route path="tools/terminal" element={<Terminal />} />
          <Route path="tools/files" element={<Files />} />
          <Route path="tools/ai" element={<AI />} />
          <Route path="tools/settings" element={<Settings />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
