/***
 * This hook manages the life-cycle for an async request and exposes the following:
 * 1. the state as it changes across the request
 * 2. A function that accepts the async as a callback and runs it.
 *
 *  By only exposing the state and a run cb, we encapsulate the complicated logic 
 * of managing the lifecycle of an async function call
 *
 */

 import React from 'react';

 export enum Status {
   Idle = 'IDLE',
   Pending = 'PENDING',
   Resolved = 'RESOLVED',
   Rejected = 'REJECTED',
 }
 
 interface IState {
   status: Status.Idle | Status.Pending | Status.Resolved | Status.Rejected;
   data: any;
   error: string | null;
 }
 
 interface IAction {
   type: Status.Idle | Status.Pending | Status.Resolved | Status.Rejected;
   data?: any;
   error?: string | null;
 }
 
 const asyncReducer: React.Reducer<IState, IAction> = (state, action): IState => {
   switch (action.type) {
     case Status.Pending:
       return {
         status: Status.Pending,
         data: null,
         error: null,
       };
 
     case Status.Resolved:
       return {
         status: Status.Resolved,
         data: action.data,
         error: null,
       };
 
     case Status.Rejected:
       return {
         status: Status.Rejected,
         data: null,
         error: action.error as string,
       };
 
     case Status.Idle:
       return {
         status: Status.Idle,
         data: null,
         error: null,
       };
     default:
       throw new Error('Unhandled action type: ' + action.type);
   }
 };
 
 const useAsync = (initialState = {}) => {
   const [state, unsafeDispatch] = React.useReducer(asyncReducer, {
     status: Status.Idle,
     data: null,
     error: null,
     ...initialState,
   });
 
   /**
    *
    * Keep track of whether the component is mounted/unmounted. This way, if an async request is resolved after a component is unmounted
    * We can no-op to avoid issues with trying to render data on an unmounted component
    */
   const mountedRef = React.useRef(false);
   React.useLayoutEffect(() => {
     mountedRef.current = true;
     return () => {
       mountedRef.current = false;
     };
   }, []);
 
   const safeDispatch: (value: IAction) => void = React.useCallback((action) => {
     if (mountedRef.current) unsafeDispatch(action);
   }, []);
 
   /**
    * Where the magic happens! This function acccepts the async callback and manages the 
    * lifecycle as it reolves around an HTTP request.
    * Specifically, the caller of this method does not 
    * have to worry about the status(pending,resolved,rejected).
    */
 
   function asyncWrapper<T>(
     asyncCallback: Promise<T>, 
     successCb?: (data: T) => void, 
     failureCb?: (errors: string) => void) {
     safeDispatch({type: Status.Pending});
 
     asyncCallback
       .then((data: T) => {
         safeDispatch({type: Status.Resolved, data});
 
         if (successCb) {
           successCb(data);
         }
       })
       .catch((error: Error) => {
         if (failureCb) {
           failureCb(error.message);
         }
         return safeDispatch({type: Status.Rejected, error: error.message});
       });
   }
 
   const run = React.useCallback(asyncWrapper, [safeDispatch]);
 
   const resetAsyncState = React.useCallback(() => {
     safeDispatch({type: Status.Idle});
   }, [safeDispatch]);
 
   return {...state, run, resetAsyncState};
 };
 
 export default useAsync;