/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_OFFLINE = 'UPDATE_OFFLINE';
export const UPDATE_WIDE_LAYOUT = 'UPDATE_WIDE_LAYOUT';
export const OPEN_DRAWER = 'OPEN_DRAWER';
export const CLOSE_DRAWER = 'CLOSE_DRAWER';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';

export const navigate = (location) => (dispatch) => {
  // Extract the page name from path.
  // Any other info you might want to extract from the path (like page type),
  // you can do here.
  const pathname = location.pathname;
  const parts = pathname.slice(1).split('/');
  const page = parts[0] || 'home';
  // book id is in the path: /detail/{bookId}
  const bookId = parts[1];
  // Extract params from location
  const params = new URLSearchParams(location.search.substring(1));
  // query is extracted from the query params: /explore?q={query}
  const query = params.get('q');

  dispatch(loadPage(page, query, bookId));
};

const loadPage = (page, query, bookId) => async (dispatch) => {
  let module;
  switch(page) {
    case 'home':
      await import('../components/book-home.js');
      break;
    case 'explore':
      module = await import('../components/book-explore.js');
      // Put code here that you want it to run every time when
      // navigate to explore page and book-explore.js is loaded.
      //
      // In this case, we want to dispatch searchBooks action.
      // In book-explore.js module it exports searchBooks so we can call the function here.
      dispatch(module.searchBooks(query));
      break;
    case 'detail':
      module = await import('../components/book-detail.js');
      // Fetch the book info for the given book id.
      dispatch(module.fetchBook(bookId));
      break;
    case 'viewer':
      module = await import('../components/book-viewer.js');
      // Fetch the book info for the given book id.
      dispatch(module.fetchBook(bookId));
      break;
    case 'about':
      await import('../components/book-about.js');
      break;
    default:
      // Nothing matches, set page to '404'.
      page = '404';
      await import('../components/book-404.js');
  }

  dispatch(updatePage(page));
}

export const refreshPage = () => (dispatch, getState) => {
  const state = getState();
  // load page using the current state
  dispatch(loadPage(state.app.page, state.books && state.books.query, state.book && state.book.id));
}

const updatePage = (page) => {
  return {
    type: UPDATE_PAGE,
    page
  };
}

export const openDrawer = () => {
  return {
    type: OPEN_DRAWER
  };
};

export const closeDrawer = () => {
  return {
    type: CLOSE_DRAWER
  };
};

let snackbarTimer;

export const showSnackbar = () => (dispatch) => {
  dispatch({
    type: OPEN_SNACKBAR
  });
  clearTimeout(snackbarTimer);
  snackbarTimer = setTimeout(() =>
    dispatch({ type: CLOSE_SNACKBAR }), 3000);
};

export const updateOffline = (offline) => (dispatch, getState) => {
  const prev = getState().app.offline;
  dispatch({
    type: UPDATE_OFFLINE,
    offline
  });
  //  automatically refresh when you come back online (offline was true and now is false)
  if (prev === true && offline === false) {
    dispatch(refreshPage());
  }
};

export const updateWideLayout = (wideLayout) => {
  return {
    type: UPDATE_WIDE_LAYOUT,
    wideLayout
  };
};