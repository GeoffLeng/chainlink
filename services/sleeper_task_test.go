package services

import (
	"sync/atomic"
	"testing"

	"github.com/onsi/gomega"
	"github.com/stretchr/testify/assert"
)

type TestWorker struct {
	counter uint64
}

func (t *TestWorker) Work() {
	atomic.AddUint64(&t.counter, 1)
}

func (t *TestWorker) Counter() uint64 {
	return atomic.LoadUint64(&t.counter)
}

func TestSleeperTask(t *testing.T) {
	worker := TestWorker{}
	sleeper := NewSleeperTask(&worker)

	assert.Equal(t, uint64(0), worker.Counter())
	startErr := sleeper.Start()
	if startErr != nil {
		return
	}

	assert.Equal(t, uint64(0), worker.Counter())

	sleeper.WakeUp()
	gomega.NewGomegaWithT(t).Eventually(func() bool {
		return worker.Counter() == 1
	}).Should(gomega.Equal(true))

	stopErr := sleeper.Stop()
	if stopErr == nil {
		assert.Equal(t, uint64(1), worker.Counter())
	}
}
