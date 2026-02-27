import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './ErrorFallback';

const ErrorBoundary = (props: { children: React.ReactNode }) => (
  <ReactErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => window.location.reload()}
  >
    {props.children}
  </ReactErrorBoundary>
);

export default ErrorBoundary;
