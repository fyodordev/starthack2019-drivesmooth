# DriveSmooth

Driving stability monitor that helps you improve your driving style.

## Summary

The idea was to design an app that can help you improve your driving style. By using a mix of data from various acceleration sensors, it measures how smooth and stable the car is being driven. The results are rendered both in a live directional output as a dot that has to be kept inside a circle, and as a general score of the last 10 minutes. When the cars acceleration or change in acceleration exceeds a certain threshold, the background turns red. It incentivizes you to handle the car more carefully, as well as be more anticipatory in traffic, facilitating safety on the road, comfort for passengers and reducing emissions thanks to a a more ecological way of driving.

The app is written entirely in Javascript, with a separate backend in Node.js, and runs in any device with a browser. It connects to the sensors using the websocket interface and does all calculations locally with minimal latency.

## UI Screenshot

![drivesmooth_screenshot](https://user-images.githubusercontent.com/5418277/54084373-11584700-4330-11e9-82f1-7b1c55cbd1e4.JPG)


## Contributors

Alexander Liebendörfer, Fyodor Perejoguine, Konstantin Wohlwend
