import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { configureStore, createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { GithubProject } from "@/api/static";
import { PartiallyRequired } from "@/utils";

const hydrate = createAction(HYDRATE);

interface ProjectsSliceState {
  fetchingDate: string | null;
  githubProjects: readonly GithubProject[];
}

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    fetchingDate: null,
    githubProjects: [],
  } as ProjectsSliceState,
  reducers: {
    loadGithubProjects(state, action: PayloadAction<Pick<ProjectsSliceState, "fetchingDate" | "githubProjects">>) {
      return { ...state, ...action.payload };
    },
  },
  extraReducers(builder) {
    builder.addCase(hydrate, (state, action) => {
      const incoming = (action.payload as any)[projectsSlice.name] as PartiallyRequired<ProjectsSliceState, "fetchingDate">;
      return !state.fetchingDate || new Date(state.fetchingDate) < new Date(incoming.fetchingDate)
        ? { ...incoming }
        : { ...state };
    });
  },
});

const makeStore = () => configureStore({
  reducer: {
    [projectsSlice.name]: projectsSlice.reducer,
  },
  devTools: true,
});

export type Store = ReturnType<typeof makeStore>;
export type State = ReturnType<Store["getState"]>;

export const storeWrapper = createWrapper(makeStore, { debug: true });

export const loadGithubProjects = projectsSlice.actions.loadGithubProjects;
export const selectGithubProjects = (state: State): readonly GithubProject[] | undefined =>
  state?.[projectsSlice.name].githubProjects;
