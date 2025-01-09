import { DataBase } from "../../../app/server_app/data/DataBase";
import * as IdGenerator from "../../../app/server_app/data/IdGenerator";

type someTypeWithId = {
  id: string;
  name: string;
  color: string;
};

describe("Database test suite", () => {
  let sut: DataBase<someTypeWithId>;

  const fakeId = "1234";

  const someObject1 = {
    id: "",
    name: "someName",
    color: "blue",
  };

  const someObject2 = {
    id: "",
    name: "someOtherName",
    color: "blue",
  };

  beforeEach(() => {
    sut = new DataBase<someTypeWithId>();
    jest.spyOn(IdGenerator, "generateRandomId").mockReturnValue(fakeId);
  });

  test("Should return id after insert", async () => {
    const actual = await sut.insert({ id: "" } as any);

    expect(actual).toBe(fakeId);
  });

  test("Should get element after insert", async () => {
    const id = await sut.insert(someObject1);
    const actual = await sut.getBy("id", id);
    expect(actual).toEqual(someObject1);
  });

  test("Should find elements with the same property", async () => {
    await sut.insert(someObject1);
    await sut.insert(someObject2);
    const expected = [someObject1, someObject2];

    const actual = await sut.findAllBy("color", "blue"); // if we dont use await it will fail

    expect(actual).toEqual(expected);
  });

  test("Should change the color on object", async () => {
    const id = await sut.insert(someObject1);

    const expectedColor = "red";

    await sut.update(id, "color", expectedColor);
    const object = await sut.getBy("id", id);

    expect(object.color).toBe(expectedColor);
  });

  test("Should delete the object", async () => {
    const id = await sut.insert(someObject1);

    await sut.delete(id);
    const object = await sut.getBy("id", id);

    expect(object).toBeUndefined();
  });

  test("Should get all elements", async () => {
    await sut.insert(someObject1);
    await sut.insert(someObject2);

    const expected = [someObject1, someObject2];

    const actual = await sut.getAllElements();

    expect(actual).toEqual(expected);
  });
});
