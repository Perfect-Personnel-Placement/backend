import getAllCurricula from '../src/curriculum/getAllCurriculaFn/getAllCurricula';
import getAllDemands from '../src/demand/getAllDemandsFn/getAllDemands';
getAllDemands().then((res) => console.log(res));
