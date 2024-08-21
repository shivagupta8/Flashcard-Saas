'use client'

import { useState } from 'react'
// import {db} from '@/firebase'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Paper,
  Dialog,
  handleCardClick,
  handleOpen,
  handleClose,
} from '@mui/material'

import {useUser} from '@clerk/nextjs'
import {writeBatch} from 'firebase/firestore'
import {useRouter} from 'next/navigation'
import {doc, collection, setDoc, getDoc} from 'firebase/firestore'


export default function Generate() {
  const {isLoaded, isSignedIn, user} = useUser()
  const [flipped, setFlipped] = useState([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [flashcards, setFlashcards] = useState([])
 
  const handleSubmit = async () => {
      fetch('api/generate', {
        method: 'POST',
        body: text,
      })
        .then((res) => res.json())
        .then((data) => setFlashcards(data))
    }

  const hadleCardClick = (id) => {
    setFlipped((prev)=> ({
      ...prev,
      [id]: !prev[id],
    }))
  }
  
  const hadleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }


  const saveFlashcards = async () => {
    if (!name) {
      alert('Please enter a name')
      return
    }

    const batch = writeBatch(db)
    const userDocRef = doc(collection(db, 'users'), user.id)
    const docSnap = await getDoc(userDocRef)

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || []
      if (collections.find((f)=> f.name===name)) {
        alert('Flashcard Collection with the same name already exists.')
        return
      } else {
        collections.push({name})
        batch.set(userDocRef, {flashcards: collections}, {merge: true})
      }
    }
    else {
      batch.set(userDocRef, {flashcards: [{name}]})
    }

    const colRef = collection(userDocRef, name)
    flashcards.forEach((flashcards) => {
      const cardDocRef = doc(colRef)
      batch.set(cardDocRef, flashcard)
    })

    await batch.commit ()
    handleClose()
    router.psuh('/flashcards')
  }

  return <Container maxWidth="md">
    <Box sx={{
      mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}>
      <Typography varinat="h4">
        Generate Flashcards
      </Typography>
      <Paper sx = {{p: 4, width: '100%'}}>
        <TextField 
        value={text}
        onChange={(e) => setText(e.target.value)}
        label="Enter text"
        fullWidth
        multiline
        rows={4}
        varinant = "outlined"

        sx = {{
          mb: 2,
        }}/>

        <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth >
          {' '}
          Submit
        </Button>
      </Paper>
    </Box>
    {flashcards.length > 0 && (
      <Box sx={{mt: 4}}>
        <Typography varaint = "h5"> Flashcards Preview</Typography>
        <Grid container spacing={3}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm ={6} md={4} key={index}>
              <Card>
                <CardActionArea 
                onClick ={() => {
                  handleCardClick(index)
                }}>
                  <CardContent>
                    <Box
                      sx={{
                        perspective: '1000px',
                        '& > div': {
                          tarnsition: 'transform 0.6s',
                          transformStyle: 'preserve-3d',
                          position: 'relative',
                          width: '100%',
                          height: '200px',
                          boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.2)',
                          transform: flipped[index]? 'rotateY(180deg)' : 'rotateY(0deg)',
                        },
                        perspective: '1000px',
                        '& > div > div': {
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 2,
                          boxSizing: 'border-box',
                        },
                        '& > div > div:nth-of-type(2)': {
                          transform: 'rotateY(180deg)',
                        
                        },
                      }}
                      >

                      <div>
                        <div>
                          <Typography varaint="h5" component="div">
                            {flashcard.front}
                          </Typography>
                        </div>
                        <div>
                        <Typography varaint="h5" component="div">
                            {flashcard.back}
                          </Typography>
                        </div>                        
                      </div>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
              </Grid>
          ))}
        </Grid>
        <Box sx={{mt:4, display: 'flex', justifyContent: 'center'}}>
          <Button varaint="contained" color="secondary" onClick={handleOpen}>
            Save
          </Button>
        </Box>
      </Box>
    )}

    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Save Flashcards</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <TextField 
          autoFocus margin="dense" 
          label="Collection Name" 
          type="text" 
          fullWidth vlue={name} 
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick = {handleClose}>  Cancel </Button>
        <Button onCLick = {saveFlashcards}> Save </Button>
      </DialogActions>
    </Dialog>
  </Container>
}


