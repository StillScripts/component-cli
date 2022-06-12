/* eslint-disable prettier/prettier */

import { VHeader } from "../components";

// This shows examples of how the Versoly component can then be used within the app
export default function UsingGeneratedComponent() {
  return (
	<div>
		<VHeader/>
		<VHeader subtitle="This is an overridden subtitle" />
	</div>
	);
}
