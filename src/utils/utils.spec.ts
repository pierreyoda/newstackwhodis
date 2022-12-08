import { isDefined } from ".";

describe("utils", () => {
  it("should properly implement the isDefined function", () => {
    expect(isDefined(0)).toEqual(true);
    expect(isDefined(NaN)).toEqual(true);
    expect(isDefined(undefined)).toEqual(false);
    expect(isDefined(null)).toEqual(false);
  });
});
