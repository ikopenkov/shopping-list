import { CreatingList, ListEntry } from 'api/ListApi/ListApiTypes';
import { ListSelectors } from 'modules/ListModule/ListSelectors';
import { ListActions } from 'modules/ListModule/ListActions';
import {
  CreatingPurchase,
  PurchaseEntry,
} from 'api/PurchaseApi/PurchaseApiTypes';
import { mockStore, TestUtils } from 'utils/TestUtils';

describe('ListModule', () => {
  let store = mockStore();

  beforeEach(() => {
    global.fetch.resetMocks();
    store = mockStore();
  });

  it('set error when list loading failed', async () => {
    TestUtils.mockFetch({ error: 'some error occured' }, { status: 500 });

    try {
      await store.dispatch(ListActions.loadItems());
    } catch (error) {}

    expect(ListSelectors.getModuleState(store.getState())).toMatchObject({
      hasError: true,
      isLoading: false,
    });
  });

  it('set loaded list to state', async () => {
    expect(ListSelectors.getIsLoaded(store.getState())).toEqual(false);

    const { existingList } = _getMocks();

    TestUtils.mockFetch({ lists: [existingList] });

    await store.dispatch(ListActions.loadItems());

    const { items, isLoaded, hasError } = ListSelectors.getModuleState(
      store.getState(),
    );

    expect({ items, isLoaded, hasError }).toMatchObject({
      items: [existingList],
      isLoaded: true,
      hasError: false,
    });
  });

  it('creates list', async () => {
    const {
      createdList,
      createdListWithPurchase,
      createdPurchase,
      creatingList,
      creatingPurchase,
    } = _getMocks();

    TestUtils.mockFetch([
      {
        list: createdList,
      },
      {
        purchase: createdPurchase,
      },
    ]);

    await store.dispatch(
      ListActions.createItem(creatingList, [creatingPurchase]),
    );

    const { items, isLoaded } = ListSelectors.getModuleState(store.getState());

    const createdItem = ListSelectors.getItem(store.getState(), '12345');

    expect(isLoaded).toEqual(false);
    expect(items.length).toEqual(1);
    expect(createdItem).toMatchObject(createdListWithPurchase);
  });

  it('deletes list', async () => {
    const { createdListWithPurchase } = _getMocks();
    store = mockStore({
      modules: {
        listModule: {
          items: [createdListWithPurchase],
        },
      },
    });

    expect(
      ListSelectors.getItem(store.getState(), createdListWithPurchase._id),
    ).toMatchObject(createdListWithPurchase);

    TestUtils.mockFetch({});

    await store.dispatch(ListActions.deleteItem(createdListWithPurchase._id));

    expect(
      ListSelectors.getItem(store.getState(), createdListWithPurchase._id),
    ).toEqual(undefined);
  });

  it('updates list', async () => {
    const { createdList, updatingList, updatedList } = _getMocks();

    store = mockStore({
      modules: {
        listModule: {
          items: [createdList],
        },
      },
    });

    TestUtils.mockFetch({ list: updatedList });

    await store.dispatch(ListActions.updateItem(createdList._id, updatingList));

    expect(
      ListSelectors.getItem(store.getState(), createdList._id),
    ).toMatchObject(updatedList);
  });

  it('loads list', async () => {
    const { existingList, createdList } = _getMocks();

    store = mockStore({
      modules: {
        listModule: {
          items: [existingList],
        },
      },
    });

    TestUtils.mockFetch({ list: createdList });

    await store.dispatch(ListActions.loadItem(createdList._id));

    expect(ListSelectors.getItems(store.getState())).toMatchObject([
      existingList,
      createdList,
    ]);
  });

  it('creates purchase', async () => {
    const {
      createdList,
      creatingPurchase,
      createdPurchase,
      createdListWithPurchase,
    } = _getMocks();

    store = TestUtils.mockStore({
      modules: {
        listModule: {
          items: [createdList],
        },
      },
    });

    TestUtils.mockFetch({ purchase: createdPurchase });

    await store.dispatch(
      ListActions.createPurchase(createdList._id, creatingPurchase),
    );

    expect(
      ListSelectors.getItem(store.getState(), createdList._id),
    ).toMatchObject(createdListWithPurchase);
  });

  it('updates purchase', async () => {
    const {
      createdListWithPurchase,
      updatingPurchase,
      updatedPurchase,
      createdListWithUpdatedPurchase,
    } = _getMocks();

    store = TestUtils.mockStore({
      modules: {
        listModule: {
          items: [createdListWithPurchase],
        },
      },
    });

    TestUtils.mockFetch({ purchase: updatedPurchase });

    await store.dispatch(
      ListActions.updatePurchase(
        createdListWithPurchase._id,
        updatedPurchase._id,
        updatingPurchase,
      ),
    );

    expect(
      ListSelectors.getItem(store.getState(), createdListWithPurchase._id),
    ).toMatchObject(createdListWithUpdatedPurchase);
  });

  it('deletes purchase', async () => {
    const {
      createdListWithPurchase,
      createdPurchase,
      createdList,
    } = _getMocks();

    store = TestUtils.mockStore({
      modules: {
        listModule: {
          items: [createdListWithPurchase],
        },
      },
    });
  
    TestUtils.mockFetch({});

    await store.dispatch(
      ListActions.deletePurchase(
        createdListWithPurchase._id,
        createdPurchase._id,
      ),
    );

    expect(
      ListSelectors.getItem(store.getState(), createdListWithPurchase._id),
    ).toMatchObject(createdList);
  });
});

const _getMocks = () => {
  const _dateFields = {
    createdAt: '2018-12-09T15:12:33.642Z',
    updatedAt: '2018-12-09T15:12:33.642Z',
  };

  const creatingList: CreatingList = {
    name: 'creating list',
  };

  const createdList: ListEntry = {
    ..._dateFields,
    ...creatingList,
    _id: '12345',
    purchases: [],
  };

  const updatingList: CreatingList = {
    name: 'updating list',
  };

  const updatedList: ListEntry = {
    ..._dateFields,
    ...updatingList,
    _id: '12345',
    purchases: [],
  };

  const creatingPurchase: CreatingPurchase = {
    name: 'purchase',
  };

  const createdPurchase: PurchaseEntry = {
    ..._dateFields,
    ...creatingPurchase,
    bought: false,
    number: 1,
    list: '12345',
    _id: '2345',
  };

  const createdListWithPurchase: ListEntry = {
    ...createdList,
    purchases: [createdPurchase],
  };

  const existingList: ListEntry = {
    ..._dateFields,
    _id: '1234',
    name: 'asdf',
    purchases: [],
  };

  const updatingPurchase: CreatingPurchase = {
    name: 'purchase',
  };

  const updatedPurchase = {
    ...createdPurchase,
    ...updatingPurchase,
  };

  const createdListWithUpdatedPurchase: ListEntry = {
    ...createdListWithPurchase,
    purchases: [updatedPurchase],
  };

  return {
    creatingList,
    createdList,
    creatingPurchase,
    createdPurchase,
    createdListWithPurchase,
    updatingList,
    updatedList,
    existingList,
    updatingPurchase,
    updatedPurchase,
    createdListWithUpdatedPurchase,
  };
};
