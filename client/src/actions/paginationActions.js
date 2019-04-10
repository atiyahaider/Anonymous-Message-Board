import { SET_PATHNAME, SET_OFFSET, SET_TOTAL, SET_LIMIT, SET_SEARCH} from './actionTypes';
import { getBoards } from './boardActions';
import { getThreadList } from './threadListActions';
import { getReplyList } from './replyListActions';

export const setTotal = (listType, total) => {
  return {
    type: SET_TOTAL,
    total,
    listType
  };
};

export const setPathname = (listType, path, board, threadId) => {
  return {
    type: SET_PATHNAME,
    pathname: {
      path,
      params: {
        board,
        threadId
      }
    },
    listType
  };
};

export const onPrevious = (listType, offset, limit, pathname) => dispatch => {
  let nextOffset = Math.max(offset - limit, 0);
  
  dispatch ({
    type: SET_OFFSET,
    offset: nextOffset,
    listType
  });

  loadPage(pathname, dispatch);
};

export const onNext = (listType, offset, limit, pathname, total) => dispatch => {
  let nextOffset = (offset + limit > total) ? offset : offset + limit

  dispatch ({
    type: SET_OFFSET,
    offset: nextOffset,
    listType
  });
  
  loadPage(pathname, dispatch);
};

export const setLimit = (listType, limit, pathname) => dispatch => {
  dispatch ({
    type: SET_LIMIT,
    offset: 0,
    limit,
    listType
  });

  loadPage(pathname, dispatch);
};

export const setSearch = (search, pathname) => (dispatch, getState) => {
  dispatch({
    type: SET_SEARCH,
    pathname: {
      params: {
        search: search
      }
    },
    offset: 0
  });
  
  dispatch(getBoards(pathname));
};

//load the next page
const loadPage = (pathname, dispatch) => {
  switch (pathname.path) {
    case '/':
      dispatch(getBoards(pathname));
      break;
    case '/threads/:board':
      dispatch(getThreadList(pathname));
      break;
    case '/replies/:board/:threadId':
      dispatch(getReplyList(pathname));
      break;
    default:
      break;
  }
};