import {HashRouter,Route,Switch,Redirect} from 'react-router-dom'
import Login from "../views/login/Login";
import NewsSandBox from "../views/newsSandBox/NewsSandBox";
import News from "../views/news/News";
import Detail from '../views/news/Detail'
function IndexRouter(props) {
    // window.localStorage.setItem('token','haha')
    return (
        <HashRouter>
           <Switch>
               <Route path='/login' component={Login}/>
               <Route path='/news' component={News}/>
               <Route path='/detail/:id' component={Detail}/>
               {/*<Route path='/' component={NewsSandBox}/>*/}
               <Route render={()=>localStorage.getItem('token')?
                   <NewsSandBox/>:
                   <Redirect to='/login'/>
               }/>
           </Switch>
        </HashRouter>
    );
}
export default IndexRouter;
