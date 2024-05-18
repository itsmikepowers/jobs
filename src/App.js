import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// Home
import Login from './components/Login';
import Demo from './components/Demo';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import Home from './components/Home';
import Onboarding from './components/Onboarding';

// Dashboard
import Settings from './components/dashboard/Settings';
import Analytics from './components/dashboard/Analytics';
import Overview from './components/dashboard/Overview';
import Job from './components/dashboard/Job';
import Screen from './components/dashboard/Screen';
import Integrations from './components/dashboard/Integrations';
import JobPost from './components/dashboard/JobPost';
import Company from './components/dashboard/Company';
import JobNew from './components/dashboard/JobNew';
import Application from './components/dashboard/Application';
import ApplicationDetail from './components/dashboard/ApplicationDetail';
import ApplicationPerson from './components/dashboard/ApplicationPerson';

// Company Landing Page
import CompanyPage from './components/company/CompanyPage';
import JobPage from './components/company/JobPage';
import ApplicationPage from './components/company/ApplicationPage';
import SuccessPage from './components/company/SuccessPage';

// Custom theme
const theme = extendTheme({
  fonts: {
    body: 'Reddit Sans, sans-serif',
    heading: 'Reddit Sans, sans-serif',
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/demo" element={<Demo />} />

          <Route path="/onboarding" element={<Onboarding />} />

          <Route path="/:companySlug" element={<CompanyPage />} />
          <Route path="/:companySlug/:jobListingId" element={<JobPage />} />
          <Route path="/:companySlug/:jobListingId/apply" element={<ApplicationPage />} />
          <Route path="/:companySlug/:jobListingId/apply/success" element={<SuccessPage />} />
          
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="job" element={<Job />} />
            <Route path="job/:jobId" element={<JobPost />} />
            <Route path="job/new" element={<JobNew />} />
            <Route path="applications" element={<Application />} />
            <Route path="applications/:jobId" element={<ApplicationDetail />} />
            <Route path="applications/:jobId/:applicationId" element={<ApplicationPerson />} />
            <Route path="screen" element={<Screen />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="settings/company" element={<Company />} />
          </Route>
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;