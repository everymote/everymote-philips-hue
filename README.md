everymote-philips-hue
=====================

Connect philips hue to everymote

## Install
```
npm install everymote-philips-hue -g
```

to run 
```
everymote-philips-hue
```

## Auto start
Her is a example on how you can get everymote-philips-hue start automaticly at startup by creating a cron jobb. Start create starteverymote.sh:
```sh
#!/bin/sh
 
sleep 60
echo "everymote philips hue"
/usr/local/bin/everymote-philips-hue
```
To register the script ass a cron jobb run

    crontab -e

and add the flowing last

    @reboot sh /dir/to/starteverymote.sh >/dir/to/log/cronout.log

Reboot and it should register all devices to everymote. Go to http://m.everymote.com and control your devices.
