import * as React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import TextIconButton from "../TextIconButton";

const mockFunction = jest.fn();

test("Text Icon Button is correctly rendered", async () => {
  render(
    <TextIconButton buttonText={"sample button"} onPress={mockFunction} />
  );
  await waitFor(() => expect(screen.getByText("sample button")).toBeTruthy());
  fireEvent.press(screen.getByText("sample button"));
  expect(mockFunction).toHaveBeenCalled();
});
