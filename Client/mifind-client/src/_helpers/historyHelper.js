import { createBrowserHistory } from 'history'

const HistoryCollection = createBrowserHistory();

function push(path){
    HistoryCollection.push(path);
}

function goBack(){
    HistoryCollection.goBack();
}

export const history = {
    push,
    goBack,
    HistoryCollection,
}
