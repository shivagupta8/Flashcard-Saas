'use client'
import { userUser } from '@clerk/nextjs'
import { useEffect, useState} from 'react'
import {collection, doc, getDoc, getDocs} from 'firebase/firestore'
import {db} from '@/firebase'
import {userSearchParams} from 'next/navigation'
import { Container } from '@mui/material'

import { useState } from 'react'
import {db} from '@/firebase'
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

export default function Flashcard() {
const [flipped, setFlipped] = useState([])
const [flashcards, setFlashcards] = useState([])
const {isLoaded, isSignedIn, user} = userUser()

const searchParams = userSearchParams()
const search = searchParams.get('id')

//Use Effect
useEffect(() => {
    async function getFlashcard() {
        if (!search || !user) return 
        const colRef = collection(doc(collection(db, 'users'), user.id), search)
        const docs = await getDocs(colRef)
        const flashcards = []

        docs.forEach((doc)=> {
            flashcards.push({id: doc.id, ...doc.data()})
        })
        setFlashcards(flashcards)
        }
        getFlashcard()   
    }, [user, search])

    const hadleCardClick = (id) => {
        setFlipped((prev)=> ({
          ...prev,
          [id]: !prev[id],
        }))
      }

      if (!isLoaded || !isSignedIn) {
        return <></>
    }

    return (
        <Container  maxWidth='100vw'>
          <Grid Container spacing={3} sx={{mt: 4}}>
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
              </Card>
              </Grid>
          ))}
        </Grid>
        
        </Container>
    )
    }

