import { Stack } from "expo-router";

const Layout = () => {
  return (
        <Stack>
          <Stack.Screen
            name="contact-list"
            options={{
              title: "Contact List",
            }}
          />
          <Stack.Screen
            name="new-contact"
            options={{
              title: "Create New Contact",
            }}
          />
          <Stack.Screen
            name="favourites"
            options={{
              title: "Favourite Contacts",
            }}
          />
          <Stack.Screen
            name="contact/[id]"
            options={{
              title: "Update Contact",
            }}
          />
        </Stack>
  )
};

export default Layout;