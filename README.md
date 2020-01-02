This is a basic demo on MVVM.

* compile: template engine
* observer: create get/set method for data. This is inside of MVVM, before compile.
* watcher: the data/value in the template in no longer variables, but watchers. So when data is changed, and watchers' update method is called, the view will be changed.
* dep: connect data with its watchers, so when data is changed, watchers' update method is called, then watcher will start to work.

## Publisher subscriber pattern
Each data is a publisher, it will collect all the the watchers in components (they are subscribers) that use the data. </br>
How to collect data: each data has a get method. When the data is used, it will put the watcher of the one that uses it into its subscriber.
How to notify every subscriber that this data is updated: each data also has a set method. When the data is changed, in set method, it will notify every subscriber


## Object.defineProperty
The heart of two-way data binding