import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"
import ReactMde from "react-mde";
import 'react-mde/lib/styles/css/react-mde-all.css';

export default function App() {
   //Todo List
   //1.) Need state to hold all the notes (array of notes), set default with localStorage 'get'
   //2.) Nneed state to hold the note that is being selected 'currentNoteId'. This will display...
   //... the selectd note or an emptystring (conditional must be used)
   //3.) Need useEffect to run localStorage ('set') and re-renders contigent upon adding notes state
   //4.) Need functions to createNewNote, updateNote(text), findCurrentNote
   //5.) Think about the props (functions) that need to be passed to SideBar and Editor 

   const [notes, setNotes] = React.useState(
        ()=> JSON.parse(localStorage.getItem("notes")) || []
     )

    //notes[0] means the array has to have a note in the array or this will not display/render
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id || "")
    )

    //the function we want to run is localStorage.setItem, contigent upon dependancy array [notes] 
    React.useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes))
    }, [notes])
    
    //create the note object with the 2 properties it needs then update the state notes array (setNotes)
    //Also need to set state currentNoteId (setCurrentNoteId) and we can pass in the newNote.id property 
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }

    //Need to updates notes array so call setNotes and pass in current array of notes (oldNotes)
    //then map over the oldNotes and if oldNote.id === currentNoteId update that note by spreading
    //... in properties and updating the body property with "text" being passed in the function
    //... or leave the note alone (Can return and use a terinary all in one line)
    // function updateNote(text) {
    //     setNotes(oldNotes => oldNotes.map(oldNote => {
    //         return oldNote.id === currentNoteId ? { ...oldNote, body: text } : oldNote
    //     }))
    // }

    //Notice updateNote above is commented out. We can't use .map if we want to re-order
    //...notes to the top of the array. There may be a way to use .map but we'll use
    //... a for loop here instead.
     function updateNote(text) {
        setNotes(oldNotes => {
            //create a new empty array
            const newArray = []
            //Loop over the original array
            for (let i=0; i<oldNotes.length; i++) {
                //if the id matches put the currentNoteId beginning of the new array (unshift)
                const oldNote = oldNotes[i];
                if (oldNote.id ===  currentNoteId) {
                    newArray.unshift({ ...oldNote, body: text})
                //else push the old note to the end of the new array
                } else {
                    newArray.push(oldNote)
                }
            }
            //return the new array
            return newArray;
        })
     }

     function deleteNote(event, noteId) {
        event.stopPropagation()
        //FKT- "Filter Keeps True"
        setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
     }



    //Can use .find on notes array... find() returns the first element in the provided array that satisfies 
    //the provided testing function. If no values satisfy the testing function, undefined is returned.
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    //Sidebar needs the notes state we created and needs setCurrentNoteId state (not currentNoteId)
    //...because it will need to toggle between 'notes' the user selects.
    //Sidebar needs the prop currentNote and we can pass it down by calling findCurrentNote() right away
    //Sidebar will be creating the newNotes so we can pass teh createNewNote function as a prop
    //Editor needs the ability to update a note so we pass it the updateNote function via a prop
    //Editor also needs the 'currentNote' we can pass down by calling findCurrentNote right away 
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
        }
        </main>
    )
}
