import { Reservation } from "../../app/server_app/model/ReservationModel";

expect.extend({
  toBeValidReservation(reservation: Reservation) {
    const validId = reservation.id.length > 5 ? true : false;
    const validUser = reservation.user.length > 5 ? true : false;

    return {
      pass: validId && validUser,
      message: () => `expected reservation to have valid id and user`,
    };
  },
  toHaveUser(reservation: Reservation, user: string) {
    const hasRightUser = reservation.user === user;

    return {
      pass: hasRightUser,
      message: () =>
        `expected reservation to have user ${user}, received ${reservation.user}`,
    };
  },
});

// Interface for the Reservation object for TypeScript

interface customMatchers<R> {
  toBeValidReservation(): R;
  toHaveUser(user: string): R;
}

// Extend the jest namespace with the customMatchers interface

declare global {
  namespace jest {
    interface Matchers<R> extends customMatchers<R> {}
  }
}

const someReservation: Reservation = {
  id: "",
  endDate: "someEndDate",
  startDate: "someStartDate",
  room: "someRoom",
  user: "someUser",
};

const anotherReservation: Reservation = {
  id: "123456",
  endDate: "someEndDate",
  startDate: "someStartDate",
  room: "someRoom",
  user: "someUser",
};

describe("customMatchers tests", () => {
  test("Check for valid reservation", () => {
    // Now we can use the custom matcher
    expect(someReservation).not.toBeValidReservation();
    expect(anotherReservation).toBeValidReservation();
    expect(anotherReservation).not.toHaveUser("someOtherUser");
    expect(anotherReservation).toHaveUser("someUser");
  });
});
