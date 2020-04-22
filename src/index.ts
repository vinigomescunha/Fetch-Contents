
import { bundleFetch } from './fetch-api';
export default bundleFetch;
// 
bundleFetch().then(allFetchs => {
    console.log(JSON.stringify(allFetchs, null, 2));
});
// async
(async () => {
    const allFetchs: any[] = await bundleFetch("../examples/apis2");
    console.log(JSON.stringify(allFetchs, null, 2));
    return true;
})();

