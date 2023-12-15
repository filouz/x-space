# Switch Automation script 

```yaml
alias: forward-switch-to-tb
description: ""
trigger:
  - platform: time_pattern
    seconds: /5
action:
  - service: mqtt.publish
    data:
      topic: espace/ha/switch
      payload: |
        {
          "active_power": "{{ states('sensor.switch1_active_power') }}"
        }

```

# Geolocation Automation script 

```yaml
alias: forward-geo-to-tb
description: ""
trigger:
  - platform: time_pattern
    seconds: /5
condition: []
action:
  - service: mqtt.publish
    data:
      topic: espace/ha/location
      payload: |
        {
          "geo": "{{ states('sensor.espace_phone_geocoded_location') }}",
          "latitude": "{{ state_attr('device_tracker.espace_phone_3', 'latitude') }}",
          "longitude": "{{ state_attr('device_tracker.espace_phone_3', 'longitude') }}"
        }
```

# Activity automation script

```yaml
alias: forward-activity-to-tb
description: ""
trigger:
  - platform: time_pattern
    seconds: /5
action:
  - service: mqtt.publish
    data:
      topic: espace/ha/activity
      payload: |
        {
          "activity": "{{ states('sensor.espace_phone_detected_activity') }}",
          "duration": "{{ ((as_timestamp(now()) - as_timestamp(states.sensor.espace_phone_detected_activity.last_changed)) | int) }}"
        }
````

