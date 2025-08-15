import { it, jest } from "@jest/globals";

jest.unstable_mockModule("../../src/controllers/user.js", () => {
  const selectMock = {
    select: jest.fn().mockResolvedValue([]),
  };

  const findMock = jest.fn().mockReturnValue(selectMock);
  const mockConstructor = jest.fn();
  mockConstructor.find = findMock;
  return { default: mockConstructor };
});

const usersController = (await import("../../src/controllers/user.js")).default;
const UserModel = (await import("../../src/models/user.js")).default;

describe("readAll test,", () => {
  it("Deberia retornar un status 200", async () => {
    // Arrange
    const mockUserList = [];
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Act
    UserModel.find().select.mockResolvedValue(mockUserList);
    await usersController.readAll(req, res);
    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      allOK: true,
      data: mockUserList,
      message: "Users retrieved successfully",
    });
  });
});
