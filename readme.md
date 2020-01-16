# Stalked

> A dead simple project time tracker CLI.

<img src='https://i.imgur.com/Gx5hpZH.png' alt="stalked CLI in action"></img>

## Install

```
npm install stalked -g
```
***Don't forget '-g' or the '--global' flag to install the package globally.***

## Usage

```
$ stalked <command> [project]
```

### Create Project

```json
$ stalked create new-project
new-project has been created
```

### Start Project

```json
$ stalked start new-project
new-project has been started
```

### Stop Project

```json
$ stalked stop new-project
new-project was ended on 01/13/2020 12:43:54
You worked on this project for 0:01:30 (HH:MM:SS) this time around.
You've worked on this project for a total of 0:10:15 (HH:MM:SS).
```

### Check Total Time on Project

```json
$ stalked time new-project
You've worked on this project for a total of 0:10:15 (HH:MM:SS).
```

### Delete Project

```json
$ stalked delete new-project
new-project was deleted
```

### List Project Names

```json
$ stalked list
new-project
```

## Local Storage

All project information is saved locally to `localstorage.json` - You have full control over your data.
