package vrf

import (
	"crypto/rand"
	"math/big"
	"testing"

	"github.com/stretchr/testify/assert"
)

func panicErr(err error) {
	if err != nil {
		panic(err)
	}
}

func TestRSAVRF_PrimeKeySize(t *testing.T) {
	bitLen := 1024
	p, err := rand.Prime(rand.Reader, bitLen)
	panicErr(err)
	assert.Equal(t, p.BitLen(), bitLen)
}

func TestRSAVRF_safePrime(t *testing.T) {
	// Short, because this is slow. Greater than 64+1, because rand.Prime
	// logic changes for smaller bit lengths
	bitLen := 66
	p := safePrime(uint32(bitLen))
	assert.Equal(t, p.BitLen(), bitLen)
}

func TestRSAVRF_Generate(t *testing.T) {
	k, err := MakeKey(150)
	panicErr(err)
	p, err := Generate(k, big.NewInt(1))
	panicErr(err)
	ok, err := p.Verify()
	if err != nil {
		panic(err)
	}
	assert.True(t, ok, "rejected a valid key")
	p.Seed = big.NewInt(2)
	ok, err = p.Verify()
	panicErr(err)
	assert.False(t, ok, "accepted an invalid key")
}
