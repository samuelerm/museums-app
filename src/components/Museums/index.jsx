import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Museums = ({ baseUrl }) => {
  const title = 'Museums';
  const [museums, setMuseums] = useState([]);
  const [newMuseumLabel, setNewMuseumLabel] = useState('');
  const [searchedMuseum, setSearchedMuseum] = useState(null);
  const [searchedMuseumId, setSearchedMuseumId] = useState('');

  useEffect(() => {
    if (baseUrl && baseUrl.trim() !== '') {
      fetchMuseums();
    }
  }, [baseUrl]);

  const fetchMuseums = async () => {
    try {
      const response = await fetch(`${baseUrl}/museums`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data['hydra:member']) {
        setMuseums(data['hydra:member']);
      } else {
        console.error('Invalid data received:', data);
      }
    } catch (error) {
      console.error('Error fetching museums:', error);
    }
  };

  const handleCreateMuseum = async () => {
    try {
      const body = {
        title: newMuseumLabel,
        idMuseum: uuidv4(),
        planURL: '',
        imageURL: '',
      };

      const response = await fetch(`${baseUrl}/floor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newMuseum = await response.json();
      setMuseums((prevMuseums) => [...prevMuseums, newMuseum]);
      setNewMuseumLabel('');
      console.log('Museum created successfully');
    } catch (error) {
      console.error('Error creating museum:', error);
    }
  };

  const editMuseum = async (id) => {
    try {
      const museumToEdit = museums.find((museum) => museum.id === id);

      const newTitle = prompt('Enter the new title:', museumToEdit.title);
      const newPlanURL = prompt('Enter the new plan URL:', museumToEdit.planURL);
      const newImageURL = prompt('Enter the new image URL:', museumToEdit.imageURL);

      if (newTitle === null || newPlanURL === null || newImageURL === null) {
        return;
      }

      const response = await fetch(`${baseUrl}/floor/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/ld+json',
        },
        body: JSON.stringify({
          idMuseum: museumToEdit.idMuseum,
          title: newTitle,
          planURL: newPlanURL,
          imageURL: newImageURL,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedMuseum = await response.json();
      setMuseums((prevMuseums) =>
        prevMuseums.map((m) => (m.id === id ? updatedMuseum : m))
      );

      console.log('Museum edited successfully');
    } catch (error) {
      console.error('Error editing museum:', error);
    }
  };

  const deleteMuseum = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/floor/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setMuseums((prevMuseums) => prevMuseums.filter((m) => m.id !== id));

      console.log('Museum deleted successfully');
    } catch (error) {
      console.error('Error deleting museum:', error);
    }
  };

  const searchMuseumById = async () => {
    try {
      const response = await fetch(`${baseUrl}/floors/${searchedMuseumId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const museum = await response.json();
      setSearchedMuseum(museum);
    } catch (error) {
      console.error('Error searching museum by ID:', error);
    }
  };

  return (
    <div>
      <h1>{title}</h1>
      <div>
        <input
          type="text"
          placeholder="New Museum Label"
          value={newMuseumLabel}
          onChange={(e) => setNewMuseumLabel(e.target.value)}
        />
        <button onClick={handleCreateMuseum}>Create New Museum</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Search Museum by ID"
          value={searchedMuseumId}
          onChange={(e) => setSearchedMuseumId(e.target.value)}
        />
        <button onClick={searchMuseumById}>Search</button>
      </div>
      <div className="museums-container">
        {searchedMuseum ? (
          <div className="museums-items">
            <h3>Searched Museum:</h3>
            <div>{searchedMuseum.title}</div>
            <div>{searchedMuseum.planURL}</div>
            <div>{searchedMuseum.imageURL}</div>
          </div>
        ) : (
          museums.map((item, index) => (
            <div className="museums-items" key={`${item.id}-${index}`}>
              {item.label}
              <button onClick={() => editMuseum(item.id)}>Edit</button>
              <button onClick={() => deleteMuseum(item.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Museums;
