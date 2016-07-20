# Wifi Signal Logger
Tracks and logs wifi signals. Signal records are stored both per time slice, and per Mac Address in MongoDB. Designed to run on Kali Linux and use Airodump-ng to track signals. 

[![Maintenance Intended](http://maintained.tech/badge.svg)](http://maintained.tech/)

## DB records info:
The logs are stored in MongoDB in two formats:
##### Time slices
An airodump record logged for a specific Mac Address signal during a time slice. Contains:
* Mac Address
* First seen
* Last seen (Time of this signal)
* Signal power
* Number of packets
* BSSID
* Probed ESSIDs
##### Device logs
A record for every Mac Address detected by the app. Contains:
* Mac Address
* Time slice records recorded with this Mac Address
* Affiliated networks (All probed Essids affiliated with the Mac Address)

## Instructions
* Load into Kali
* Follow the installation process below
* Connect a wifi device
* Confirm that the wifi device works, ex: 'airmon-ng start wlan0' 
* Start this app: 'npm start'

## Installation
```
cd {DIRECTORY}
npm install

```

# License
The MIT License (MIT)

Copyright (c) 2016 Eric Zhao (Node/DB scripts), George Chigrichenko (Java scripts)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.