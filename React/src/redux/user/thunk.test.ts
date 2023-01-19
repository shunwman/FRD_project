import configureMockStore, { MockStoreEnhanced } from "redux-mock-store";
import thunk from "redux-thunk";

import fetchMock from "fetch-mock";

import { fetchLogin } from "./thunk";
import { IRootState } from "../store";


describe("Board thunks", () => {
    let store: MockStoreEnhanced<IRootState>;

    beforeEach(() => {
        const mockStore = configureMockStore<IRootState>([thunk]);
        store = mockStore();
    });

    it("should update displayName successfully", async () => {
        fetchMock.post(`${process.env.REACT_APP_API_HOST}/login`, {
            body: {
                status: "successful",
                displayName: "James From Express"
            },
            status: 400
        })

        await store.dispatch(fetchLogin(""));

        const actions = store.getActions();

        expect(actions[0].type).toBe(fetchLogin.pending.type)
        expect(actions[1].type).toBe(fetchLogin.rejected.type)
    })
})