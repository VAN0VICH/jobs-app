import React, { FC, Fragment, ReactElement } from 'react';
import { useRouter } from 'next/router';

import { LayoutType, RoutePath, routesConfiguration, ScopeType } from 'routes';

import MainLayout from './MainLayout';
import PrivateScope from './PrivateScope';
import UnauthorizedLayout from './UnauthorizedLayout';

import 'resources/job-application/job-application.handlers';

const layoutToComponent = {
  [LayoutType.MAIN]: MainLayout,
  [LayoutType.UNAUTHORIZED]: UnauthorizedLayout,
};

const scopeToComponent = {
  [ScopeType.PUBLIC]: Fragment,
  [ScopeType.PRIVATE]: PrivateScope,
};

interface PageConfigProps {
  children: ReactElement;
}

const PageConfig: FC<PageConfigProps> = ({ children }) => {
  const { route } = useRouter();

  const { scope, layout } = routesConfiguration[route as RoutePath] || {};
  const Scope = scope ? scopeToComponent[scope] : Fragment;
  const Layout = layout ? layoutToComponent[layout] : Fragment;

  return (
    <Scope>
      <Layout>{children}</Layout>
    </Scope>
  );
};

export default PageConfig;
