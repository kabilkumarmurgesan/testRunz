import React from 'react';
import PrivateRoute from '../components/PrivateRoute';
import { Router } from '@reach/router';
import MyPage from './mypage';
import Runs from './runs';
import RunsDetails from './runs/details/[id]';
import Login from './login';
import ForgotPassword from './forgot-password';
import ResetPassword from './create-password';
import OTP from './otp';
import Procedures from './procedures';
import ProcedureDetails from './procedures/details/[id]';
import Projects from './projects';
import Assets from './assets';
import Billings from './billings';
import AssetDetails from './assets/details/[id]';
import NotificationPage from './settings/notifications';
import UsersPage from './settings/users';
import ProfilePage from './settings/profile';
import RolesPage from './settings/roles';
// import CustomFields from "./settings/custom-fields";
import { Provider } from 'react-redux';
import store, { persistor } from '../utils/store';
import { ApolloProvider } from '@apollo/client';
import { client } from '../utils/config';
import { PersistGate } from 'redux-persist/integration/react';
import { Helmet } from 'react-helmet';
import favicon from '../assets/images/common/favicon.svg';
import { ToastContainer } from 'react-toastify';

const IndexPage: React.FC = () => {
  return (
    <Provider store={store}>
      <Helmet>
        <title>Test Runs</title>
        <link rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={false}
        hideProgressBar={true}
      />
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={client}>
          <Router basepath="/">
            <Login path="/" />
            <Login path="/login" />
            <OTP path="/otp" />
            <ResetPassword path="/create-password" />
            <ForgotPassword path="/forgot-password" />
            <PrivateRoute path="/mypage" component={MyPage} />
            <PrivateRoute path="/runs" component={Runs} />
            <PrivateRoute path="/details/:id" component={RunsDetails} />
            <PrivateRoute path="/procedures" component={Procedures} />
            <PrivateRoute path="/projects" component={Projects} />
            <PrivateRoute path="/assets" component={Assets} />
            <PrivateRoute path="/details/:id" component={AssetDetails} />
            <PrivateRoute path="/details/:id" component={ProcedureDetails} />
            <PrivateRoute path="/notifications" component={NotificationPage} />
            <PrivateRoute path="/profile" component={ProfilePage} />
            <PrivateRoute path="/users" component={UsersPage} />
            <PrivateRoute path="/roles" component={RolesPage} />
            {/* <PrivateRoute path="/custom-fields" component={CustomFields} /> */}
            <PrivateRoute path="/billings" component={Billings} />
          </Router>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  );
};

export default IndexPage;
