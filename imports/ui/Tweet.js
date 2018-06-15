import React from 'react';

export default function Tweet(props) {
    const value = props.value;
    return (
        <div className="card">
            <div className="card-body">
                <p className="card-text">{value.text}</p>
            </div>
        </div>
    );
  }