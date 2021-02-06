import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { configureStore, createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { GithubProject } from "@/api/github/static";

const hydrate = createAction(HYDRATE);

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    githubProjects: [],
  } as {
    githubProjects: readonly GithubProject[];
  },
  reducers: {
    loadGithubProjects(state, action: PayloadAction<readonly GithubProject[]>) {
      return { ...state, githubProjects: action.payload };
    },
  },
  extraReducers(builder) {
    builder.addCase(hydrate, (state, action) => {
      // TODO: real reconciliation, based on export date?
      const hydratedGithubProjects = (action.payload as any)[projectsSlice.name].githubProjects;
      return {
        githubProjects: state.githubProjects.length < hydratedGithubProjects.length
          ? hydratedGithubProjects
          : state.githubProjects,
      };
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
