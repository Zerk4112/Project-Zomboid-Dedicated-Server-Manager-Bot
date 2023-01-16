killProcesses() {
        echo "Looking for processes for '$1'"
        processCount=`ps -ef | grep $1 | grep -v grep | wc -l`
        processList=`ps -ef | grep $1 | grep -v grep | tr -s ' ' ',' | cut -f2 -d,`
        echo "processCount: $processCount"
        if [ $processCount -gt 0 ]; then
                echo "processList: $processList"
                echo "Processes found: Starting kill loop.\n"
                for p in $processList; do
                        echo "Killing processId: $p"
                        kill -9 $p
                done
        fi
#       echo "Sleeping for 5 seconds"
#       sleep 5s
}
init() {
        killProcesses "cloudflared"
        killProcesses "node app.js"

        if [[ $1 = "stop" ]]; then
                echo "services terminated"
                return
        fi

        echo "starting tunnel and node app"
        cloudflared tunnel run pzdbot > /dev/null 2>&1 &
        node app.js > /dev/null 2>&1 &
}

init $1
