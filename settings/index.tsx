function SLClockSettings(props): JSX.Element {
  return (
    <Page>
      <Section
        title={
          <Text bold align="center">
            SL Clock
          </Text>
        }
      >
        <TextInput settingsKey="weatherApiKey" title="OpenWeatherMap Api Key" />
        <Toggle settingsKey="weatherCacheEnabled" label="Cache Weather" />
      </Section>
    </Page>
  );
}

registerSettingsPage(SLClockSettings);
