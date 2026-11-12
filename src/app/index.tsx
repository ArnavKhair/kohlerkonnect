import { Redirect } from 'expo-router';

export default function Index() {
  // Prototype entry point: begin with the onboarding flow.
  return <Redirect href="/onboarding" />;
}
