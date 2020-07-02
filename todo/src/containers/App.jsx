import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import img from '../images/beer_celebration.svg';


function BottomButton(props){
    let styleName='btn-oper';
    props.hide&&(styleName +=' hide');
    return <div className={styleName} onClick={()=> props.onClick()}>{props.btnText}</div>;
    
}
function DateFormater() {
    var currentDay = new Date();
    var weekDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var month = currentDay.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    var day = currentDay.getDate();
    day= day < 10 ? '0' + day : day;
    var year = currentDay.getFullYear();
    return (
            <div className='date'>
                <div>{weekDay[currentDay.getDay()]}</div>
                <div>{month}-{day}-{year}</div>
            </div>
            ); //获取周几0-6
}

function Item(props){
    return (
        <li >
            <input type="checkbox" className="todo-check" checked={props.haveDone} onChange={()=>props.onCheckClick(props.index)}/>
            <span className="txt"> {props.value} </span>
            <span className="delete" onClick={()=>{props.onDelete(props.index)}}></span>
        </li>

    )
}
function generateID(){
    return Date.now()+'-'+Math.floor(Math.random()*1000);
}
// props:todoThings [{id,value}], haveDone:bool,total:number
         
class List extends React.Component{
    constructor(props){
        super(props);
        this.state={
            todoThings:this.props.todoThings,
            hide:this.props.hide
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.todoThings!==this.state.todoThings){
            this.setState({todoThings:nextProps.todoThings});
        }
        if(nextProps.hide!==this.state.hide){
            this.setState({hide:nextProps.hide});
        }
    }
    
    render(){
        const todoThings=this.state.todoThings;
        const haveDone=this.props.haveDone;
        const listItems=todoThings.map((thing,index) => 
            <Item key={thing.id} index={thing.id} value={thing.value} haveDone={haveDone} onCheckClick={this.props.onCheckClick} onDelete={this.props.onDelete}/>
        );
        let list;
        if(!haveDone){
            return (listItems.length?
                                    (<div>
                                        <div className="summary">You have {listItems.length} pending items</div>
                                        <ul className='todolist'>
                                            {listItems}
                                        </ul>
                                    </div>)
                                :
                                    (<div className="empty">
                                        <img src={img} /> Time to chill! You have no todos.
                                    </div>)
                    )
        }else{
            const total=this.props.total;
            const styleName=this.state.hide?'hide':'';
            return (listItems.length>0 && 
                                    (<div className={styleName}>
                                        <div className="summary">Completed tasks:{Math.floor(listItems.length / total * 100)} %</div>
                                        <ul className='todolist completelist'>
                                            {listItems}
                                        </ul>
                                    </div>)
                    )
                                    
                                
        }
        
        
    }
}

class App extends React.Component{
    constructor(props){
        super(props);
        this.state={
            inputValue:'',
            data: JSON.parse(localStorage.getItem('list'))||[],
            btnClass:'btn',
            btnFlag:false

        }
    }
    handleChange=(e)=>{
        console.log(this.state.data);
        this.setState({inputValue:e.target.value});
        e.target.value.length?
            this.setState({btnClass:'btn btnAdd'}):this.setState({btnClass:'btn'});
            
    }
    handleAddClick=()=>{
        if(this.state.inputValue.trim().length){
            let newThing={};
            newThing.id=generateID();
            newThing.value=this.state.inputValue;
            newThing.flag=false;
            let data=this.state.data.concat(newThing);
            console.log(data);
            localStorage.setItem('list',JSON.stringify(data));
            this.setState({inputValue:'', btnclass:'btn', data:data});
        }
        
    }
    handleCheckClick(index){
        const data=this.state.data;
        const thingIndex=data.findIndex(thing=>thing.id==index);
        data[thingIndex].flag=!data[thingIndex].flag;
        localStorage.setItem('list',JSON.stringify(data));
        this.setState({data:data});
        
    }
    handleDelete=(index)=>{
        const data=this.state.data;
        data.splice(data.findIndex(thing=>thing.id==index),1);
        localStorage.setItem('list',JSON.stringify(data));
        this.setState({data:data});
    }
    handleDeleteAll=()=>{
        localStorage.removeItem('list');
        this.setState({data:[]});
    }
    handleShow=()=>{
        const btnFlag=!this.state.btnFlag;
        this.setState({btnFlag:btnFlag});

    }

    render(){
        const doThings=this.state.data.filter(thing=>!thing.flag);
        const doneThings=this.state.data.filter(thing=>thing.flag);

        return(
            <div>
                <h1>Daily To-Do list manager</h1>
                <div className="box">
                    <DateFormater/>
                    <form>
                        <input type="text" className='inputTxt' value={this.state.inputValue} onChange={this.handleChange} placeholder="Take the garbage out" />
                        <div className={this.state.btnClass} onClick={this.handleAddClick}>+</div>
                    </form>
                    <List todoThings={doThings} haveDone={false}  onCheckClick={this.handleCheckClick.bind(this)} onDelete={this.handleDelete}/>
                    <List todoThings={doneThings} haveDone={true} hide={!this.state.btnFlag} total={this.state.data.length} onCheckClick={this.handleCheckClick.bind(this)} onDelete={this.handleDelete}/>
                    <div className='operation'>
                        <BottomButton btnText={ this.state.btnFlag?'Hide Complete':'Show Complete'}  hide={doneThings.length>0?false:true} onClick={this.handleShow}/>
                        <BottomButton btnText='Clear All' hide={this.state.data.length>0?false:true}  onClick={this.handleDeleteAll}/>
                    </div>
                    
                </div>
            </div>
        )
    }
}


export default App;