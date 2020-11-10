/**
 * A mocked version of the instabug-reactnative package.
 */

const BugReporting = {
  onSDKDismissedHandler: jest.fn(),
  setReportTypes: jest.fn(),
  reportType: {},
  showWithOptions: jest.fn(),
  option: {}
};

const Replies = {
  setInAppNotificationsEnabled: jest.fn(),
  setOnNewReplyReceivedCallback: jest.fn(() => null),
  show: jest.fn(),
  getUnreadRepliesCount: jest.fn(() => Promise.resolve(0)),
  hasChats: jest.fn((cb: (param: boolean) => void) => cb(false))
};

const Chats = {
  setEnabled: jest.fn(),
  show: jest.fn()
};

export { BugReporting, Replies, Chats };

export default {
  locale: jest.fn(),
  startWithToken: jest.fn(),
  setChatNotificationEnabled: jest.fn(),
  invocationEvent: {},
  BugReporting,
  Replies,
  Chats
};
