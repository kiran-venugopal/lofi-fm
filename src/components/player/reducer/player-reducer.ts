export const initialPlayerState = {
  isInfoVisible: false,
  videoMeta: {},
  isCashtabVisible: false,
};

export type ActionType = {
  type: string;
  payload: any;
};

export type PlayerStateType = {
  isInfoVisible: boolean;
  videoMeta: {
    current?: number;
    duration?: number;
  };
  isCashtabVisible: boolean;
};

export function playerReducer(
  state = initialPlayerState,
  action: ActionType
): PlayerStateType {
  const { type, payload } = action;
  switch (type) {
    case "SET_SHOW_INFO":
      return {
        ...state,
        isInfoVisible: payload,
      };
    case "SET_SHOW_CASHTAB":
      return {
        ...state,
        isCashtabVisible: payload,
      };
    case "SET_VIDEO_META":
      return {
        ...state,
        videoMeta: payload,
      };
    default:
      return state;
  }
}
